export default function RadioButton({ optionObj, selectedOptionId, onSelect, disabled }) {

    return (
        <label onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 text-xl text-slate-700">
            <input
                type="radio"
                name="pollOption"
                value={optionObj.id}
                checked={selectedOptionId === String(optionObj.id)}
                disabled={disabled}
                onChange={(e) => {
                    onSelect(e.currentTarget.value)
                }}
                className="size-5 accent-slate-800"
            />

            {optionObj.text}
        </label>
    )
}