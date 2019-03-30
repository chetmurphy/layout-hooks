export interface IEditHelperProps {
  editHelper: () => EditHelper
}

export enum Status {
  disabled = 0,
  down,
  up
}

export interface ICommand {
  name: string
  command: (status: Status) => Status | undefined
  status?: (() => Status) | Status | undefined
}

export interface IEditTool {
  updateTool: () => void
}

export class EditHelper {
  private _commands: Map<string, (state: Status) => Status | undefined>
  private _status: Map<string, (() => Status) | number | undefined>
  private _updateTool: IEditTool | undefined

  constructor() {
    this._commands = new Map()
    this._status = new Map()
    this._updateTool = undefined
  }

  public register = (editTool: IEditTool) => {
    this._updateTool = editTool
  }

  public clear() {
    this._commands.clear()
    this._status.clear()
  }

  public load(commands: ICommand[]) {
    this._commands.clear()
    this._status.clear()
    commands.forEach((item: ICommand) => {
      this._commands.set(item.name, item.command)
      this._status.set(item.name, item.status)
    })

    if (this._updateTool) {
      this._updateTool.updateTool()
    }
  }

  public do = (name: string) => {
    const command = this._commands.get(name)
    if (command) {
      const v = this._status.get(name)
      if (v && typeof v === 'function') {
        command(v())
      } else if (v && typeof v === 'number') {
        const status = command(v as Status)
        if (status) {
          this._status.set(name, status)
        }
      }
    }
  }

  public status = (name: string) => {
    const r = this._status.get(name)
    if (r && typeof r === 'function') {
      return r()
    } else if (r && typeof r === 'number') {
      return r as Status
    }
    return Status.disabled
  }
}
