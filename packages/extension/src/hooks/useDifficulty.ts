import { DifficultySelectors } from "@mswp/solver"
import { DifficultyType } from "@mswp/solver/src/types"

import { useEffect, useState } from "react"

export default function useDifficulty() {
    const [difficulty, setDifficulty] = useState(DifficultyType.MEDIUM)

    useEffect(() => {
        ;[
            DifficultyType.EASY,
            DifficultyType.MEDIUM,
            DifficultyType.HARD
        ].forEach((diff) => {
            DifficultySelectors[diff].addEventListener("click", () => {
                setDifficulty(diff)
            })
        })
    }, [])

    return difficulty
}
