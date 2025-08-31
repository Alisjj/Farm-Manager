import { useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { type DailyLog } from "../../services/dailyLogService";
import { House } from "../../services/houseService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Props {
  initial?: DailyLog;
  onCreate: (data: any) => Promise<void>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onCancel: () => void;
  houses?: House[];
  housesLoading?: boolean;
}

const schema = z.object({
  houseId: z.string().min(1, "House is required"),
  date: z.string().min(1, "Date is required"),
  morningEggs: z.coerce.number().min(0, "Must be 0 or greater"),
  afternoonEggs: z.coerce.number().min(0, "Must be 0 or greater"),
  feedConsumed: z.coerce.number().min(0, "Must be 0 or greater"),
  mortality: z.coerce.number().min(0, "Must be 0 or greater"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function DailyLogForm({
  initial,
  onCreate,
  onUpdate,
  onCancel,
  houses = [],
  housesLoading = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      houseId: initial?.houseId ?? "",
      date:
        initial?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      morningEggs: initial?.morningEggs ?? 0,
      afternoonEggs: initial?.afternoonEggs ?? 0,
      feedConsumed: initial?.feedConsumed ?? 0,
      mortality: initial?.mortality ?? 0,
      notes: initial?.notes ?? "",
    },
  });

  useEffect(() => {
    reset({
      houseId: initial?.houseId ?? "",
      date:
        initial?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      morningEggs: initial?.morningEggs ?? 0,
      afternoonEggs: initial?.afternoonEggs ?? 0,
      feedConsumed: initial?.feedConsumed ?? 0,
      mortality: initial?.mortality ?? 0,
      notes: initial?.notes ?? "",
    });
    // focus the house select when opening the form for a new entry
    if (!initial) {
      setTimeout(() => setFocus("houseId"), 0);
    }
  }, [initial]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (initial) {
        await onUpdate(initial.id, data);
      } else {
        await onCreate(data);
      }
      reset();
    } catch (err) {
      throw err;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="text-xs text-slate-600">House</label>
        <select
          {...register("houseId")}
          aria-invalid={!!errors.houseId}
          aria-describedby={errors.houseId ? "houseId-error" : undefined}
          className={`mt-1 block w-full rounded-md border px-2 py-2 text-sm ${
            errors.houseId ? "border-red-500" : ""
          }`}
          disabled={housesLoading}
        >
          <option value="">Select House</option>
          {houses.length > 0 ? (
            houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))
          ) : (
            <>
              <option value="house-1">House 1</option>
              <option value="house-2">House 2</option>
            </>
          )}
        </select>
        {errors.houseId && (
          <div
            id="houseId-error"
            role="alert"
            className="text-xs text-red-600 mt-1"
          >
            {errors.houseId.message}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-slate-600">Date</label>
        <Input
          {...register("date")}
          type="date"
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? "date-error" : undefined}
          className={errors.date ? "border-red-500" : ""}
        />
        {errors.date && (
          <div
            id="date-error"
            role="alert"
            className="text-xs text-red-600 mt-1"
          >
            {errors.date.message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-600">Morning Eggs</label>
          <Input
            {...register("morningEggs", { valueAsNumber: true })}
            type="number"
            aria-invalid={!!errors.morningEggs}
            aria-describedby={
              errors.morningEggs ? "morningEggs-error" : undefined
            }
            className={errors.morningEggs ? "border-red-500" : ""}
          />
          {errors.morningEggs && (
            <div
              id="morningEggs-error"
              role="alert"
              className="text-xs text-red-600 mt-1"
            >
              {errors.morningEggs.message}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-slate-600">Afternoon Eggs</label>
          <Input
            {...register("afternoonEggs", { valueAsNumber: true })}
            type="number"
            aria-invalid={!!errors.afternoonEggs}
            aria-describedby={
              errors.afternoonEggs ? "afternoonEggs-error" : undefined
            }
            className={errors.afternoonEggs ? "border-red-500" : ""}
          />
          {errors.afternoonEggs && (
            <div
              id="afternoonEggs-error"
              role="alert"
              className="text-xs text-red-600 mt-1"
            >
              {errors.afternoonEggs.message}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-600">Feed Consumed (kg)</label>
        <Input
          {...register("feedConsumed", { valueAsNumber: true })}
          type="number"
          aria-invalid={!!errors.feedConsumed}
          aria-describedby={
            errors.feedConsumed ? "feedConsumed-error" : undefined
          }
          className={errors.feedConsumed ? "border-red-500" : ""}
        />
        {errors.feedConsumed && (
          <div
            id="feedConsumed-error"
            role="alert"
            className="text-xs text-red-600 mt-1"
          >
            {errors.feedConsumed.message}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-slate-600">Mortality</label>
        <Input
          {...register("mortality", { valueAsNumber: true })}
          type="number"
          aria-invalid={!!errors.mortality}
          aria-describedby={errors.mortality ? "mortality-error" : undefined}
          className={errors.mortality ? "border-red-500" : ""}
        />
        {errors.mortality && (
          <div
            id="mortality-error"
            role="alert"
            className="text-xs text-red-600 mt-1"
          >
            {errors.mortality.message}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-slate-600">Notes</label>
        <textarea
          {...register("notes")}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          className="mt-1 block w-full rounded-md border px-2 py-2 text-sm h-24"
        />
        {errors.notes && (
          <div
            id="notes-error"
            role="alert"
            className="text-xs text-red-600 mt-1"
          >
            {errors.notes.message}
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Saving..." : initial ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
