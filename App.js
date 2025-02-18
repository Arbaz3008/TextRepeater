import React, { useState, useRef } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Clipboard } from "react-native";

export default function TextRepeater() {
  const [text, setText] = useState("");
  const [repeatCount, setRepeatCount] = useState("1");
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("normal");
  const [selectedColor, setSelectedColor] = useState("black");
  const intervalRef = useRef(null);

  const handleTextChange = (input) => {
    setText(input);
    if (input.trim() === "") {
      setOutput([]);
      stopRepeating();
    }
  };

  const startRepeating = () => {
    if (!text || isNaN(parseInt(repeatCount)) || parseInt(repeatCount) <= 0) return;

    stopRepeating();
    setOutput([]);
    setIsRunning(true);

    let count = 0;
    intervalRef.current = setInterval(() => {
      if (count >= parseInt(repeatCount)) {
        stopRepeating();
        return;
      }
      setOutput((prev) => [...prev, text]);
      count++;
    }, 500);
  };

  const stopRepeating = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const copyToClipboard = () => {
    if (output.length > 0) {
      Clipboard.setString(output.join("\n"));
      alert("Copied to Clipboard!");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Text Repeater</Text>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Enter text"
              value={text}
              onChangeText={handleTextChange}
              style={styles.textInput}
              multiline
              maxLength={200}
            />

            <TextInput
              placeholder="Repeat"
              value={repeatCount}
              onChangeText={setRepeatCount}
              keyboardType="numeric"
              style={styles.countInput}
            />
          </View>

          <Picker
            selectedValue={selectedStyle}
            onValueChange={(itemValue) => setSelectedStyle(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Bold" value="bold" />
            <Picker.Item label="Italic" value="italic" />
            <Picker.Item label="Underline" value="underline" />
          </Picker>

          <Picker
            selectedValue={selectedColor}
            onValueChange={(itemValue) => setSelectedColor(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Black" value="black" />
            <Picker.Item label="Red" value="red" />
            <Picker.Item label="Blue" value="blue" />
            <Picker.Item label="Green" value="green" />
          </Picker>

          <TouchableOpacity
            onPress={isRunning ? stopRepeating : startRepeating}
            style={[styles.button, { backgroundColor: isRunning ? "red" : "purple" }]}
          >
            <Text style={styles.buttonText}>{isRunning ? "Stop" : "Start"}</Text>
          </TouchableOpacity>

          <View style={styles.outputContainer}>
            <FlatList
              data={output}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text 
                  style={{ 
                    fontSize: 16, 
                    fontWeight: selectedStyle === "bold" ? "bold" : "normal", 
                    fontStyle: selectedStyle === "italic" ? "italic" : "normal", 
                    textDecorationLine: selectedStyle === "underline" ? "underline" : "none", 
                    color: selectedColor, 
                    marginBottom: 5 
                  }}
                >
                  {item}
                </Text>
              )}
            />
          </View>

          <TouchableOpacity onPress={copyToClipboard} style={[styles.button, { backgroundColor: "purple" }]}>
            <Text style={styles.buttonText}>Copy to Clipboard</Text>
          </TouchableOpacity>
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textInput: {
    flex: 2,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e6e7e8",
    marginRight: 10,
    height: 80,
    textAlignVertical: "top",
  },
  countInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: "#e6e7e8",
    height: 50,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  outputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#e6e7e8",
    height: 150,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
});
