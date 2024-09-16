import "./ButtonEditForm.less";
import { Action, ActionType, options } from "../../definitions.d";
import Input from "./Input";
import Select from "./Select";
import { createSignal } from "solid-js";
import { JSXElement } from "solid-js";
import IconsPanelSelector from "./IconsPanelSelector";
interface ButtonEditFormProps {
    onSubmit: (buttonObj: Action) => void
    onDelete: () => void
    defaultAction?: Action
}

export default function (props: ButtonEditFormProps) {

    const handler = (e: SubmitEvent) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const label = formData.get("action-label")?.toString()
        const type = formData.get("action-type")?.toString() as ActionType | undefined
        const value = formData.get("action-value")?.toString()
        if (label && type && value)
            props.onSubmit({ type, value, label })
    }
    const [getDynElement, setDynElement] = createSignal<JSXElement>(null)

    return <>
        <div class="form-bg">
            <form class="button-edit-form" onSubmit={handler}>
                <div class="input-container">
                    <Input id="action-label" name="action-label" label="Label" required
                        defaultValue={props.defaultAction?.label}
                    />
                    <a class="icon-attachment" onclick={() => setDynElement(<IconsPanelSelector onSubmit={(r) => {
                        const inputEl: HTMLInputElement | null = document.querySelector(`#action-label`)
                        if (inputEl) inputEl.value = r
                        setDynElement(null)
                    }} />)}></a>
                </div>

                <Select label="Type" name="action-type" id="action-type" required>
                    {
                        [...options].sort((a) => a == props.defaultAction?.type ? -1 : 1).map(opt => <option>{opt}</option>)
                    }
                </Select>
                <Input id="action-value" name="action-value" label="Value" required defaultValue={props.defaultAction?.value} />
                <div class="bottom-btns">
                    <a class="delete-btn" onclick={props.onDelete}>Delete</a>
                    <button>Concluir</button>
                </div>
            </form>
        </div>
        {getDynElement()}
    </>
}