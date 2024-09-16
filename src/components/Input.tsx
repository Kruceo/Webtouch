import "./Input.less"

export default function (props: { required?: boolean, defaultValue?: string, onChange?: (v: string) => void, type?: "text" | "number", label: string, name?: string, id: string, class?: string }) {
    const onChange = props.onChange ?? function () { }
    return <>
        <div class="input">
            <label class="entry" for={props.id}>
                <input name={props.name} id={props.id} placeholder="_" type={props.type} required={props.required} value={props.defaultValue ?? ""} onchange={(e) => onChange(e.currentTarget.value)} />
                <div class="top">
                    <div class="l"></div>
                    <p class="top-label">{props.label}</p>
                    <div class="r"></div>
                </div>
                <div class="bottom"></div>
            </label>
        </div></>
}