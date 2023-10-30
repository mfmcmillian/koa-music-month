import { QuestInstance } from '@dcl/quests-client'
import ReactEcs, {
  EntityPropTypes,
  UiBackgroundProps,
  UiButtonProps,
  UiLabelProps,
  UiTransformProps
} from '@dcl/sdk/react-ecs'

type LabelProps = EntityPropTypes & UiLabelProps

export type QuestHudOptions = {
  autoRender?: boolean
  leftSidePanel?: UiTransformProps
  questBox?: {
    uiBackground?: UiBackgroundProps
    uiTransform?: UiTransformProps
  }
  questNameContainer?: {
    uiTransform?: UiTransformProps
    label?: LabelProps
  }
  stepsContainer?: {
    uiTransform: UiTransformProps
    labels?: {
      labelUiEntity?: UiTransformProps
      props?: LabelProps
    }
    showTasksButton?: {
      buttonUiEntity: UiTransformProps
      buttonProps?: UiButtonProps
    }
  }
  tasksBox?: {
    uiTransform?: UiTransformProps
    uiBackground?: UiBackgroundProps
    labels?: {
      labelUiEntity?: UiTransformProps
      props?: LabelProps
    }
  }
  nextSteps?: {
    nextTitleUiEntity?: UiTransformProps
    nextTitleProps?: LabelProps
    labels?: {
      labelUiEntity?: UiTransformProps
      props?: LabelProps
    }
  }
  questCompletionLabel?: {
    uiTransform?: UiTransformProps
    label?: LabelProps
  }
  showHideToggleButton?: UiButtonProps
  closeTasksBoxButton?: UiButtonProps
}

type QuestHUD = {
  upsert: (instance: QuestInstance) => void
  getHUDComponent: () => () => ReactEcs.JSX.Element
  render: () => void
  updateOptions: (opts: QuestHudOptions) => void
  getHUDComponentWithUpdatedOptions: (newOpts: QuestHudOptions) => () => ReactEcs.JSX.Element
}
