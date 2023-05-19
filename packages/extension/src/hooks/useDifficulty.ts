import { DifficultySelectors } from "@mswp/solver"
import { DifficultyType } from "@mswp/solver/src/types"

import { useEffect } from "react"

export default function useDifficultyListener(cb: (difficulty: DifficultyType) => void, deps: any[]) {
    useEffect(() => {
        ;[
            DifficultyType.EASY,
            DifficultyType.MEDIUM,
            DifficultyType.HARD
        ].forEach((diff) => {
            DifficultySelectors[diff].addEventListener("click", () => {
                cb(diff)
            })
        })
    }, deps)
}
