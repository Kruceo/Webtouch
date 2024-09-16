import { JSX } from "solid-js";
import "./Input.less";

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
}

export default function Select(props: SelectProps) {
    return <div class="input">
        <label class="entry" for={props.id}>
            <select name={props.name} id={props.id}>
                {props.children}
            </select>
            <div class="top">
                <div class="l"></div>
                <p class="top-label">{props.label}</p>
                <div class="r"></div>
            </div>
            <div class="bottom"></div>
        </label>
    </div>
}