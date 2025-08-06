import { create } from 'zustand';

/**
 * Rates store to manage real-time rate data
 */
export const useRatesStore = create((set:any) => ({
    rates: {},
    futureRates: {},
    lastUpdated: null,

    // Update rates with new data from socket
    updateRates: (ratesData:any) => set((state:any) => ({
        rates: { ...state.rates, ...ratesData },
        lastUpdated: new Date()
    })),
    updateFutureRates: (futureRatesData:any) => set((state:any) => ({
        futureRates: { ...state.futureRates, ...futureRatesData },
        lastUpdated: new Date()
    })),
    // Reset rates data
    resetRates: () => set({
        rates: {},
        futureRates: {},
        lastUpdated: null
    })
}));
