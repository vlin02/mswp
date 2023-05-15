export function difference(hi: string[], lo: string[]) {
    let i = 0
    let j = 0
    let N1 = hi.length
    let N2 = lo.length
    const ret = []
    while (i < N1 && j < N2) {
        if (hi[i] === lo[j]) {
            j++
        } else {
            ret.push(hi[i])
        }
        i++
    }
    if (j !== N2) return null
    for (; i < N1; i++) {
        ret.push(hi[i])
    }
    return ret
}

export function merge(hi :string[], lo: string[]) {
    let i = 0
    let j = 0
    let N1 = hi.length
    let N2 = lo.length
    const ret = []
    while (i < N1 && j < N2) {
        if (hi[i] === lo[j]) {
            return null
        } else if (hi[i] < lo[j]) {
            ret.push(hi[i++])
        } else {
            ret.push(lo[j++])
        }
    }
    for (; i < N1; ) {
        ret.push(hi[i++])
    }
    for (; j < N2; ) {
        ret.push(lo[j++])
    }

    return ret
}

export function shash(hi: string[]) {
    return hi.join(",")
}