import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

export default function Map(){
  return (
    <View style={styles.mapContainer}>
        <WebView
            originWhitelist={['*']}
            source={{
            html: `<!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        width: 100%;
                    }
                    iframe {
                        border: 0;
                        width: 100%;
                        height: 100%;
                    }
                    </style>
                </head>
                <body>
                    <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.553610232007!2d74.872304!3d31.6207555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39197b56f2cd8541%3A0x89dbada23c0531fb!2sMohinder%20Singh%20Jewellers!5e0!3m2!1sen!2sin!4v1721200000000"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                </body>
                </html>`
            }}
            style={{ flex: 1 }}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

})