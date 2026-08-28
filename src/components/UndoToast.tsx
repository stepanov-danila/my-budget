interface UndoToastProps {
  message: string
  onUndo: () => void
}

export function UndoToast({ message, onUndo }: UndoToastProps) {
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
        <span>{message}</span>
        <button
          type="button"
          onClick={onUndo}
          className="font-semibold text-blue-300 dark:text-blue-700"
        >
          Отменить
        </button>
      </div>
    </div>
  )
}
