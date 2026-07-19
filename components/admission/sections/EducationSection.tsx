"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import { Plus, Trash2 } from "lucide-react";

// ============================================
// CONSTANTS (ported directly from index.html)
// ============================================
const EXAM_TYPES = ["SSC", "HSC", "Honors", "Degree", "Masters"];

const BOARDS = [
  "Dhaka", "Rajshahi", "Comilla", "Jessore", "Chittagong",
  "Barisal", "Sylhet", "Dinajpur", "Mymensingh", "Madrasah", "BTEB",
];

const UNIVERSITIES = [
  "National University", "Dhaka University", "Rajshahi University",
  "Chittagong University", "Jahangirnagar University", "Islamic University",
  "Khulna University", "BUET", "SUST", "Jagannath University",
  "Comilla University", "Barisal University", "Begum Rokeya University",
];

const GROUPS_GENERAL = ["Science", "Humanities", "Business Studies"];
const GROUPS_BTEB = [
  "Civil Technology", "Computer Technology", "Electrical Technology",
  "Mechanical Technology", "Power Technology", "Electronics Technology",
  "Architecture", "Automobile",
];

const SUBJECTS_HONORS = [
  "Bangla", "English", "Political Science", "Economics", "Accounting",
  "Management", "Marketing", "Finance", "Physics", "Chemistry", "Mathematics",
  "Botany", "Zoology", "CSE", "EEE", "Geography", "Psychology", "History",
  "Islamic History", "Sociology",
];

const SUBJECTS_DEGREE = ["BA", "BSS", "BBS", "BSc"];

const SUBJECTS_MASTERS = [
  "MBA", "MSS", "MA", "MSc", "LLM", "Masters in Bangla", "Masters in English",
  "Masters in Political Science", "Masters in Economics",
];

const RESULT_TYPES = ["Pass", "First Class", "Second Class", "Third Class", "Grade"];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);

// ============================================
// HELPER: derive board/group options from exam+board
// ============================================
function getBoardOptions(exam: string): string[] {
  if (["SSC", "HSC"].includes(exam)) return BOARDS;
  if (["Honors", "Degree", "Masters"].includes(exam)) return UNIVERSITIES;
  return BOARDS;
}

function getBoardLabel(exam: string): string {
  if (["Honors", "Degree", "Masters"].includes(exam)) return "University";
  return "Board";
}

function getGroupOptions(exam: string, board: string): string[] {
  if (["SSC", "HSC"].includes(exam)) {
    return board === "BTEB" ? GROUPS_BTEB : GROUPS_GENERAL;
  }
  if (exam === "Honors") return SUBJECTS_HONORS;
  if (exam === "Degree") return SUBJECTS_DEGREE;
  if (exam === "Masters") return SUBJECTS_MASTERS;
  return [];
}

function getGroupLabel(exam: string): string {
  if (["Honors", "Degree", "Masters"].includes(exam)) return "Subject";
  return "Group";
}

function getGpaMax(exam: string): number {
  return ["SSC", "HSC", "BTEB"].includes(exam) ? 5.0 : 4.0;
}

function getGpaLabel(exam: string): string {
  return ["SSC", "HSC", "BTEB"].includes(exam) ? "GPA (max 5.00)" : "CGPA (max 4.00)";
}

// ============================================
// Per-row watcher component
// ============================================
function EduRow({ index, remove }: { index: number; remove: () => void }) {
  const { register, control, setValue, formState: { errors } } =
    useFormContext<AdmissionFormValues>();

  const exam = useWatch({ control, name: `education.${index}.exam` as const }) ?? "";
  const board = useWatch({ control, name: `education.${index}.board` as const }) ?? "";
  const resultType = useWatch({ control, name: `education.${index}.resultType` as const }) ?? "";

  const boardOptions = getBoardOptions(exam);
  const groupOptions = getGroupOptions(exam, board);
  const gpaMax = getGpaMax(exam);
  const showGrade = resultType === "Grade";

  // When exam changes, clear board, group, result
  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(`education.${index}.exam`, e.target.value);
    setValue(`education.${index}.board`, "");
    setValue(`education.${index}.group`, "");
  };

  // When board changes, clear group
  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(`education.${index}.board`, e.target.value);
    setValue(`education.${index}.group`, "");
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-40";

  const labelCls = "block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider whitespace-nowrap";

  const edu = (errors.education as Record<string, unknown>)?.[index] as Record<string, { message?: string }> | undefined;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
      <div className="grid gap-2 items-center" style={{ gridTemplateColumns: "2fr 2.5fr 2.5fr 1.2fr 1.6fr 2fr 1.8fr 1.5fr 36px" }}>

        {/* 1. Exam */}
        <div>
          <select {...register(`education.${index}.exam` as const)} onChange={handleExamChange} className={inputCls}>
            <option value="">— Exam —</option>
            {EXAM_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          {edu?.exam && <p className="text-red-500 text-[10px] mt-0.5">{edu.exam.message}</p>}
        </div>

        {/* 2. Board / University */}
        <div>
          <select {...register(`education.${index}.board` as const)} onChange={handleBoardChange} disabled={!exam} className={inputCls}>
            <option value="">{exam ? `— ${getBoardLabel(exam)} —` : "— Exam first —"}</option>
            {boardOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {edu?.board && <p className="text-red-500 text-[10px] mt-0.5">{edu.board.message}</p>}
        </div>

        {/* 3. Group / Subject */}
        <div>
          <select {...register(`education.${index}.group` as const)} disabled={!exam || groupOptions.length === 0} className={inputCls}>
            <option value="">{groupOptions.length === 0 ? "— N/A —" : `— ${getGroupLabel(exam)} —`}</option>
            {groupOptions.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* 4. Passing Year */}
        <div>
          <select
            {...register(`education.${index}.passingYear` as const, { valueAsNumber: true })}
            className={inputCls}
          >
            <option value="">— বছর —</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {edu?.passingYear && <p className="text-red-500 text-[10px] mt-0.5">{edu.passingYear.message}</p>}
        </div>

        {/* 5. Roll No */}
        <div>
          <input type="text" {...register(`education.${index}.rollNumber` as const)} placeholder="Roll No" className={inputCls} />
        </div>

        {/* 6. Reg No */}
        <div>
          <input type="text" {...register(`education.${index}.registrationNumber` as const)} placeholder="Reg No" className={inputCls} />
        </div>

        {/* 7. Result Type */}
        <div>
          <select {...register(`education.${index}.resultType` as const)} className={inputCls}>
            <option value="">— Result —</option>
            {RESULT_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {edu?.resultType && <p className="text-red-500 text-[10px] mt-0.5">{edu.resultType.message}</p>}
        </div>

        {/* 8. GPA / CGPA */}
        <div>
          <input
            type="number" step="0.01" min="0" max={gpaMax}
            {...register(`education.${index}.resultValue` as const)}
            placeholder={showGrade ? `max ${gpaMax}` : "—"}
            disabled={!showGrade}
            className={inputCls}
            onBlur={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > gpaMax) e.target.value = gpaMax.toFixed(2); }}
          />
          {edu?.resultValue && <p className="text-red-500 text-[10px] mt-0.5">{edu.resultValue.message}</p>}
        </div>

        {/* 9. Delete */}
        <div className="flex items-center justify-center">
          <button type="button" onClick={remove} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Remove">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ============================================
// MAIN SECTION
// ============================================
export default function EducationSection({ id }: { id: string }) {
  const { control } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const addRow = () =>
    append({
      exam: "",
      board: "",
      group: "",
      passingYear: new Date().getFullYear(),
      rollNumber: "",
      registrationNumber: "",
      resultType: "",
      resultValue: "",
    });

  return (
    <section
      id={id}
      className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28"
    >
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t("sec_education")}
        </h2>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("add_education")}
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-slate-400 dark:text-slate-600 text-sm">
            কোনো শিক্ষাগত যোগ্যতা যোগ করা হয়নি।
          </p>
          <button
            type="button"
            onClick={addRow}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
          >
            <Plus className="w-4 h-4" /> প্রথম যোগ্যতা যোগ করুন
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Column header row — same grid as EduRow */}
          <div
            className="grid gap-2 px-3 pb-2 border-b border-slate-200 dark:border-slate-800"
            style={{ gridTemplateColumns: "2fr 2.5fr 2.5fr 1.2fr 1.6fr 2fr 1.8fr 1.5fr 36px" }}
          >
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">পরীক্ষা</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">বোর্ড / বিশ্ববিদ্যালয়</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">গ্রুপ / বিষয়</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">পাস সাল</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">রোল নং</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">রেজি নং</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">ফলাফল</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">GPA / CGPA</div>
            <div></div>
          </div>
          {fields.map((field, index) => (
            <EduRow key={field.id} index={index} remove={() => remove(index)} />
          ))}
        </div>
      )}


    </section>
  );
}
