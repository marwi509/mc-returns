import { Gaussian } from "ts-gaussian"
var _ = require('lodash');

export interface Result {
    endResult: number
    cagr: number
    saved: number
    totalReturn: number,
    series: number[]
}

export const simulateReturn = async (
    years: number, 
    yearReturn: number, 
    startValue: number,
    stdDev: number,
    monthlySavings: number,
    samples: number
    ): Promise<Map<number, Result>> => {
        return new Promise( resolve => {
        const bucketSize = (startValue + monthlySavings*years*12) / 10000
        const results = new Map<number, {result: Result, nbr: number}>()
        for (let i = 1; i <= samples; i ++) {
            if (i% 100000 === 0) {
                console.log(i)
            }

            
            const res = sample(years, yearReturn, startValue, stdDev, monthlySavings)
            const destination = Math.round(res.endResult / bucketSize)
            const existing = results.get(destination)
            if (existing == null) {
                results.set(destination, {
                    result: res, nbr: 1
                })
            } else {
                results.set(destination, {
                    result: existing.result, nbr: existing.nbr + 1
                })
            }
        }
        
        const c = Array.from(results.entries())
            .map(a => a[1])
            .sort((a,b) => a.result.endResult - b.result.endResult)

        let currCount = 0
        for (let i = 0; i < c.length; i ++) {
            currCount += c[i].nbr
            c[i].nbr = currCount
        }
        const newMap = new Map<number, {result: Result, diff: number, index: number}[]>
        for (let i = 0; i < c.length; i ++) {
            let indexRaw = (100*c[i].nbr) / currCount
            let guessedIndex = Math.round((100*c[i].nbr) / currCount)
            let diff = Math.abs(indexRaw - guessedIndex)
            const newObject = {
                result: c[i].result,
                diff: diff,
                index: guessedIndex,
            }
            const d = newMap.get(guessedIndex)
            if (d == null) {
                newMap.set(guessedIndex, [newObject])
            } else {
                newMap.set(guessedIndex, [...d, newObject])
            }
        }

        console.log(newMap)
        let lastMap = new Map<number, Result>()
        for (let i = 0; i <= 100; i ++) {
            let d = newMap.get(i)
            
            if (d == null) {
                console.log(i + "null")
                d = newMap.get(i - 1)!
            }
                console.log(i + "not null") 
                d.sort((a,b) => a.diff - b.diff)
                const res = d[0]
                lastMap.set(i, res.result)
            
            
        }

        return resolve(lastMap)
    })



    }

const sample = (years: number, 
    yearReturn: number, 
    startValue: number,
    stdDev: number,
    monthlySavings: number,): Result => {
        let currentValue = startValue
        const monthlyStdDev = (stdDev / 100) / Math.sqrt(12)
        const monthlyReturn = ((yearReturn/100)/12) + 1
        let saved = 0
        let noSavings = 1
        const gauss = new Gaussian(monthlyReturn, monthlyStdDev*monthlyStdDev)
        
        let series: number[] = [startValue]
        for (let i = 1; i <= years * 12; i ++) {
            const ret = gauss.ppf(Math.random())
            currentValue *= ret
            currentValue += monthlySavings
            noSavings *= ret
            saved += monthlySavings
            series.push(Math.round(currentValue))
        }

        const resultingCagr = Math.pow(noSavings, 1/years)
        return {
            endResult: Math.round(currentValue), 
            cagr: resultingCagr, 
            saved: saved + startValue, 
            totalReturn: currentValue - saved - startValue,
            series: series
        }
    }

    /*
    fun sample(years: Int): Result {
    var currentValue = startValue
    val monthlyStdDev = (stdDev / 100) / sqrt(12.0)
    val monthlyReturn = ((meanReturn/100.0)/12.0 + 1.0)
    var saved = 0.0
    var noSavings = startValue
    //println(monthlyStdDev)
    //println(monthlyReturn)
    IntRange(1, years * 12).forEach { _ ->
        val ret = random.nextGaussian(monthlyReturn, monthlyStdDev)
        currentValue *= ret
        currentValue += monthlySavings
        noSavings *= ret
        saved += monthlySavings
    }
    val resultingCagr = (noSavings / startValue).pow(1.0 / years)
    return Result(currentValue.roundToLong(), resultingCagr.toFloat(), saved.roundToLong(), currentValue.roundToLong() - (saved.roundToLong() + startValue.roundToLong()))
}
    */