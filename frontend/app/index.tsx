import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className={"color-blue-900 bg-gray-500"}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
