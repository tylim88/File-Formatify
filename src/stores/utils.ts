import { get, set, del } from 'idb-keyval'
import {
	persist,
	createJSONStorage,
	type PersistOptions,
} from 'zustand/middleware'
import {
	type UseBoundStore,
	type StoreApi,
	type StateCreator,
	create,
} from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Draft } from 'immer'

type Hydration = {
	hydrated: boolean
	setHydrated: () => void
	reset: () => void
}

type Reset = {
	reset: () => void
}

export const persistent = <T extends { [s: string]: unknown }>(
	{
		// change this value to reset indexed db
		version = 20,
		name,
		keysToPersist,
	}: {
		version?: number
		name: string
		keysToPersist: (keyof T)[]
	},
	initializer: StateCreator<
		T & Reset,
		[['zustand/persist', unknown], ['zustand/immer', never]]
	>
): UseBoundStore<
	WithImmer<
		Write<
			StoreApi<T & Hydration & Reset>,
			StorePersist<T & Hydration & Reset, unknown>
		>
	>
> =>
	create<
		T & Hydration & Reset,
		[['zustand/persist', unknown], ['zustand/immer', never]]
	>(
		persist(
			immer((set, get, store) => ({
				hydrated: false satisfies boolean,
				setHydrated: () => {
					set({ hydrated: true } as Partial<T & Hydration>)
				},
				...initializer(
					// @ts-expect-error ...
					set,
					get,
					store
				),
			})),
			{
				version,
				name,
				onRehydrateStorage: state => {
					// * need delay(minimum delay is enough) because we cannot use `set` immediately after rehydrate
					// * even if the `set` is successfully called, the data might be empty, this is probably because redux-persist does not work well with idb-keyval. This problem require longer delay to mitigate.
					// * this deduction might be incorrect, need more investigation
					// TODO solve this permanently
					setTimeout(() => {
						state.setHydrated()
					}, 2000)
				},
				migrate: (persistedState, ver) => {
					if (ver !== version) {
						return {} as T & Hydration
					}
					return persistedState as T & Hydration
				},
				partialize: state =>
					Object.fromEntries(
						Object.entries(state).filter(([key]) => keysToPersist.includes(key))
					),
				// https://blog.muvon.io/frontend/starting-with-zustand
				storage: createJSONStorage(() => ({
					getItem: async (name: string): Promise<string | null> => {
						return (await get(name)) || null
					},
					setItem: (name: string, value: string): Promise<void> => {
						return set(name, value)
					},
					removeItem: (name: string): Promise<void> => {
						return del(name)
					},
				})),
			}
		)
	)

type PersistListener<S> = (state: S) => void
type StorePersist<S, Ps> = {
	persist: {
		setOptions: (options: Partial<PersistOptions<S, Ps>>) => void
		clearStorage: () => void
		rehydrate: () => Promise<void> | void
		hasHydrated: () => boolean
		onHydrate: (fn: PersistListener<S>) => () => void
		onFinishHydration: (fn: PersistListener<S>) => () => void
		getOptions: () => Partial<PersistOptions<S, Ps>>
	}
}
type Write<T, U> = Omit<T, keyof U> & U
type WithImmer<S> = Write<S, StoreImmer<S>>
type StoreImmer<S> = S extends {
	getState: () => infer T
	setState: infer SetState
}
	? SetState extends (...a: infer A) => infer Sr
		? {
				setState(
					nextStateOrUpdater: T | Partial<T> | ((state: Draft<T>) => void),
					shouldReplace?: boolean | undefined,
					...a: SkipTwo<A>
				): Sr
			}
		: never
	: never

type SkipTwo<T> = T extends {
	length: 0
}
	? []
	: T extends {
				length: 1
		  }
		? []
		: T extends {
					length: 0 | 1
			  }
			? []
			: T extends [unknown, unknown, ...infer A]
				? A
				: T extends [unknown, unknown?, ...infer A]
					? A
					: T extends [unknown?, unknown?, ...infer A]
						? A
						: never
