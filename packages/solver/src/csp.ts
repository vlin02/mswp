import * as ops from "./seq-ops"

export type BaseCondition = {
    seq: string[]
    cnt: number
}

type Condition = BaseCondition & {
    key: string
    toDel: string[]
}

export type Resolved = { [key: string]: boolean }

type Params = {
    maxDepth?: number
}

export function satisfy(conds: BaseCondition[], { maxDepth = 2 }: Params = {}) {
    let iter = 0
    const visitedHashes = new Set<string>()
    const queue: Condition[] = []
    const atElement: { [key: string]: Set<Condition> } = {}
    const obsoleteConds = new Set()
    const allResolved: Resolved = {}

    conds.forEach((cond) =>
        cond.seq.forEach((el) => (atElement[el] = new Set()))
    )

    function addToQueue(cond: BaseCondition, resolved: Resolved) {
        const pos =
            cond.cnt === cond.seq.length ? true : cond.cnt === 0 ? false : null

        if (pos != null) {
            cond.seq.forEach((el) => (resolved[el] = pos))
            return false
        }

        const key = ops.shash(cond.seq)

        if (visitedHashes.has(key)) return false
        visitedHashes.add(key)

        const cond1: Condition = { ...cond, key, toDel: [] }

        queue.push(cond1)
        cond.seq.forEach((el) => atElement[el].add(cond1))

        return true
    }

    function pruneResolved(resolved: Resolved) {
        const reducableConds = new Set<Condition>()
        Object.entries(resolved)
            .sort((a, b) => (a[0] > b[0] ? 1 : -1))
            .forEach(([el, pos]) => {
                atElement[el].forEach((nbr) => {
                    nbr.toDel.push(el)
                    nbr.cnt -= Number(pos)
                    reducableConds.add(nbr)
                })
                allResolved[el] = pos
            })

        reducableConds.forEach((nbr) => {
            const s1 = ops.difference(nbr.seq, nbr.toDel) as string[]
            nbr.seq = s1
            nbr.key = ops.shash(s1)
            nbr.toDel = []

            if (visitedHashes.has(nbr.key)) {
                nbr.seq.forEach((el) => atElement[el].delete(nbr))
                obsoleteConds.add(nbr)
            } else {
                visitedHashes.add(nbr.key)
            }
        })
    }

    const dfsResolved = {}
    function dfs(seq: string[], cnt: number, i: number, depth: number) {
        if (depth > 0) {
            const cond = { seq, cnt, key: ops.shash(seq), toDel: [] }
            addToQueue(cond, dfsResolved)
        }

        if (depth === maxDepth || i === conds.length) return

        for (let j = i; j < conds.length; j++) {
            const nxt = ops.merge(seq, conds[j].seq)
            if (nxt == null) continue
            dfs(nxt, cnt + conds[j].cnt, j + 1, depth + 1)
        }
    }
    dfs([], 0, 0, 0)
    pruneResolved(dfsResolved)

    let iter1 = 0
    while (queue.length > 0) {
        iter += 1
        const cond = queue.pop() as Condition

        if (obsoleteConds.has(cond)) continue

        const nbrs = new Set<Condition>()
        cond.seq.forEach((el) => atElement[el].forEach((nbr) => nbrs.add(nbr)))

        const resolved1: Resolved = {}

        nbrs.forEach((nbr) => {
            iter1 += 1
            if (cond === nbr) return
            const [lo, hi] =
                cond.seq.length < nbr.seq.length ? [cond, nbr] : [nbr, cond]

            const seq = ops.difference(hi.seq, lo.seq)
            if (seq == null) return

            const cnt = hi.cnt - lo.cnt

            const cond1 = {
                seq,
                key: ops.shash(seq),
                cnt,
                toDel: []
            }
            addToQueue(cond1, resolved1)
        })

        pruneResolved(resolved1)
    }

    return allResolved
}
