export default function RadioButton({ optionObj, selectedOptionId, onSelect }) {

    return (
        <label>
            <input
                type="radio"
                name="pollOption"
                value={optionObj.id}
                checked={selectedOptionId === String(optionObj.id)}
                onChange={(e) => {
                    onSelect(e.currentTarget.value)
                }}
            />

            {optionObj.text}
        </label>
    )
}