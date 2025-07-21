import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const InspiringQuote = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Simulate fetching a quote
        setTimeout(() => {
            setQuote('The best way to get started is to quit talking and begin doing.');
        }, 1000);
    }, []);

    return (
        <View style={{ padding: 20 }}>
            {quote ? <Text style={{ fontSize: 18, color: 'black' }}>{quote}</Text> : <Text>Loading...</Text>}
        </View>
    );
};

export default InspiringQuote;
