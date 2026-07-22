export default function RadioButton({ optionObj, selectedOptionId, onSelect, disabled }) {

    return (
        <label>
            <input
                type="radio"
                name="pollOption"
                value={optionObj.id}
                checked={selectedOptionId === String(optionObj.id)}
                disabled={disabled}
                onChange={(e) => {
                    onSelect(e.currentTarget.value)
                }}
            />

            {optionObj.text}
        </label>
    )
}