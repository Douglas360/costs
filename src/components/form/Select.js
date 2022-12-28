import styles from './Select.module.css'
export function Select({ text, name, option, handleOnchange, value }) {
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <select name={name} id={name} onChange={handleOnchange} value={value || ''}>
                <option>Selecione uma opção</option>
                {option.map((opt) => (
                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                ))}
            </select>

        </div>

    )
}