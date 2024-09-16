interface ButtonProps {
    editMode: boolean,
    hidden?: boolean,
    label?: string
    onClick?: () => void
}

import { createEffect } from "solid-js";
import "./Button.less";

export default function (props: ButtonProps) {
    let el: HTMLButtonElement | undefined;

    createEffect(() => {
        el?.classList.add("entry")
        setTimeout(() => el?.classList.remove("entry"), 500)
    }, null)

    return <button ref={el} onclick={props.onClick} class={`controller-button ${props.hidden ? "hidden" : ""} ${props.editMode ? "edit-mode" : ""}`}>
        {
            props.label?.startsWith("icon") ?
                <i class={props.label} />
                : props.label
        }
    </button>
}