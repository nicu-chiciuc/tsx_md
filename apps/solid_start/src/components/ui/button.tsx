import { cva } from 'class-variance-authority'
import type { ComponentProps, ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { cn } from '../../lib/utils'

const buttonVariants = cva('text-blue-600 no-underline')

type ButtonProps<T extends ValidComponent = 'button'> = {
  as?: T
  class?: string
} & Omit<ComponentProps<T>, 'class'>

export function Button<T extends ValidComponent = 'button'>(
  props: ButtonProps<T>,
) {
  const [local, others] = splitProps(props as ButtonProps, ['as', 'class'])

  return (
    <Dynamic
      component={local.as ?? 'button'}
      class={cn(buttonVariants(), local.class)}
      {...others}
    />
  )
}
