import './App.less'
import Button from './components/Button'
import ButtonEditForm from './components/ButtonEditForm'
import { createEffect, createSignal, JSX } from 'solid-js'
import backend from './backend'
import { Action, ConfigFile } from '../definitions'
import Input from './components/Input'
import IconsPanelSelector from './components/IconsPanelSelector'

function App() {
  const [getEditMode, setEditMode] = createSignal(false)
  const [getDynamicComponent, setDynamicComponent] = createSignal<JSX.Element>(null)
  const [getGridTemplate, setGridTemplate] = createSignal<[x: number, y: number]>([0, 0])

  function editModeButtonHandler(id: number) {
    setDynamicComponent(<ButtonEditForm defaultAction={getActions().at(id) ?? undefined}
      onDelete={async () => {
        await backend.deleteAction(id)
        setDynamicComponent(null)
        updateActions()
      }}
      onSubmit={async (d) => {
        const res = await backend.updateAction(id, d.label, d.type, d.value)
        console.log(res)
        setDynamicComponent(null)
        updateActions()
      }} />)
  }

  const [getActions, setActions] = createSignal<(Action | null)[]>([])

  async function updateGrid(cols?: number, rows?: number) {
    const current = getGridTemplate()
    const newCols = cols ?? current[0]
    const newRows = rows ?? current[1]
    setGridTemplate([newCols, newRows])
    await fetch('/grid', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: newRows, cols: newCols })
    })
  }

  async function updateActions() {
    const res = await backend.getConfig()
    setGridTemplate(res.gridTemplate)
    setActions(res.actions)
  }

  createEffect(updateActions, [])

  return (
    <>
      {getDynamicComponent()}
      <header id='options-deck'>
        <button onclick={() => document.querySelector("body")?.requestFullscreen()}><a class='icon-enlarge'></a></button>
        <button onclick={() => setEditMode(!getEditMode())}>{getEditMode() ? <a class='icon-floppy-disk'></a> : <a class='icon-wrench'></a>}</button>
        {getEditMode() ?
          <>
            <Input id='columns' label='cols' type='number' onChange={(e) => updateGrid(e ? parseInt(e) : undefined, undefined)} defaultValue={getGridTemplate()[0].toString()}></Input>
            <Input id='columns' label='rows' type='number' onChange={(e) => updateGrid(undefined, e ? parseInt(e) : undefined)} defaultValue={getGridTemplate()[1].toString()}></Input>
          </> : null
        }

      </header>
      <div class="content">
        <div class='controller-grid' style={{
          "display": "grid",
          "grid-template-columns": `repeat(${getGridTemplate()[0]},1fr)`,
          "grid-template-rows": `repeat(${getGridTemplate()[1]},1fr)`
        }}>
          {
            elMap(getGridTemplate()[0] * getGridTemplate()[1])
              .map(actionId => {
                return <>
                  <Button
                    editMode={getEditMode()}
                    onClick={() => getEditMode() ? editModeButtonHandler(actionId) : backend.spawnAction(actionId)}
                    label={getActions().at(actionId)?.label}
                    hidden={getEditMode() || getActions().at(actionId) ? false : true}
                  />
                </>
              })
          }

        </div>
      </div>
    </>
  )
}

export default App

function elMap(n: number) {
  const p: number[] = []
  for (let i = 0; i < n; i++) {
    p.push(i)
  }
  return p
}

