import { autoMigrate, sequelize } from "../../../src/utils/database.js";
import LaborerModel from "../../../src/models/Laborer.js";
import WorkAssignmentModel from "../../../src/models/WorkAssignment.js";
import PayrollModel from "../../../src/models/Payroll.js";
import laborService from "../../../src/services/laborService.js";

beforeAll(async () => {
  await autoMigrate();
});

afterAll(async () => {
  await sequelize.close();
});

describe("laborService.generatePayrollForMonth", () => {
  test("generates payroll with full attendance (netPay equals base salary)", async () => {
    // create laborer
    const laborer = await LaborerModel.create({
      name: "Test Laborer",
      monthlySalary: 1000,
    });

    // create assignments for each working day in Aug 2025
    const year = 2025,
      month = 8;
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      if (date.getDay() === 0) continue; // skip Sundays
      await WorkAssignmentModel.create({
        laborerId: laborer.id,
        date: `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(
          2,
          "0"
        )}`,
        attendanceStatus: "present",
      });
    }

    const result = await laborService.generatePayrollForMonth("2025-08");
    // find payroll for our laborer
    const p = result.find((r) => r.laborerId === laborer.id);
    expect(p).toBeDefined();
    expect(Number(p.grossPay)).toBeCloseTo(1000);
    expect(Number(p.netPay)).toBeCloseTo(1000);

    // cleanup
    await PayrollModel.destroy({ where: { laborerId: laborer.id } });
    await WorkAssignmentModel.destroy({ where: { laborerId: laborer.id } });
    await LaborerModel.destroy({ where: { id: laborer.id } });
  });
});
