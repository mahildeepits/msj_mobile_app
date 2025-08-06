import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type RateChangeIndicatorProps = {
    value: number | string;
    showCurrenyFormat?: boolean;
    showDecimals?: boolean;
    styleFormat?: any;
};

export const RateChangeIndicator: React.FC<RateChangeIndicatorProps> = ({
    value,
    showCurrenyFormat = false,
    showDecimals = false,
    styleFormat = {},
}) => {
    const [colorClass, setColorClass] = useState('');
    const previousValueRef = useRef(Number(value));

    const withCurrencySymbol = (val: any) => {
        const num = Number(val);
        if (isNaN(num)) return '--';
        return num.toLocaleString(undefined, {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        });
    };

    const withoutCurrencySymbol = (val: any) => {
        const num = Number(val);
        if (isNaN(num)) return '--';
        return num.toLocaleString(undefined, {
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        });
    };

    const decideClass = (current: any, prev: any) => {
        if (current > prev) return 'up';
        if (current < prev) return 'down';
        return '';
    };

    useEffect(() => {
        const currVal = Number(value);
        if (currVal !== previousValueRef.current) {
            const cls = decideClass(currVal, previousValueRef.current);

            if (cls) {
                setColorClass(cls);
                const timeout = setTimeout(() => setColorClass(''), 800);
                previousValueRef.current = currVal;
                return () => clearTimeout(timeout);
            }
        }
    }, [value]);

    return (
        <Text style={[styleFormat,
            colorClass == 'up' ? styles.rateUp : (colorClass == 'down' ? styles.rateDown : styles.textBlack)
        ]}>
            {showCurrenyFormat
                ? withCurrencySymbol(value)
                : withoutCurrencySymbol(value)}
        </Text>
    );
};

const styles = StyleSheet.create({
    rateUp: {
        color: 'green',
        backgroundColor:'rgba(255,255,255,0.5)',
        borderRadius:2,
        paddingHorizontal:5
    },
    rateDown: {
        color: '#d50000',
        backgroundColor:'rgba(255,255,255,0.5)',
        borderRadius:2,
        paddingHorizontal:5
    },
    textBlack: {
        color: 'black'
    }
});
