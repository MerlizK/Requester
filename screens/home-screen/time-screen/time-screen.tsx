import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { APIURL } from "../../../Constants";

const SpecialTimeSetting = () => {
  const [selectedTab, setSelectedTab] = useState("time");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [weeklyTime, setWeeklyTime] = useState({
    Sunday: { start: "09:00", end: "17:00" },
    Monday: { start: "09:00", end: "17:00" },
    Tuesday: { start: "09:00", end: "17:00" },
    Wednesday: { start: "09:00", end: "17:00" },
    Thursday: { start: "09:00", end: "17:00" },
    Friday: { start: "09:00", end: "17:00" },
    Saturday: { start: "09:00", end: "17:00" },
  });

  const [specialTime, setSpecialTime] = useState({
    start: "09:00",
    end: "17:00",
  });

  const fetchWeeklySchedule = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${APIURL}shop/weekly-schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const schedule = response.data[0].dayOfWeek;

      const updatedWeeklyTime = schedule.reduce((acc, day) => {
        acc[day.day] = { start: day.open, end: day.close };
        return acc;
      }, {});

      setWeeklyTime(updatedWeeklyTime);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  const fetchSpecialHours = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${APIURL}shop/special-operating-hours`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const specialHours = response.data[0];

      setSpecialTime({
        start: specialHours.open,
        end: specialHours.close,
      });
    } catch (error) {
      console.error("Error fetching special hours:", error);
    }
  };

  useEffect(() => {
    fetchWeeklySchedule();
    fetchSpecialHours();
  }, []);

  const submitWeeklySchedule = async () => {
    const dayOfWeek = Object.keys(weeklyTime).map((day) => ({
      day,
      open: weeklyTime[day].start,
      close: weeklyTime[day].end,
    }));

    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(
        `${APIURL}shop/create-weekly-schedule`,
        { dayOfWeek },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Weekly schedule updated successfully");
    } catch (error) {
      console.error("Error updating weekly schedule:", error);
    }
  };

  const submitSpecialHours = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(
        `${APIURL}shop/create-special-operating-hours `,
        {
          date: selectedDay,
          open: specialTime.start,
          close: specialTime.end,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Special operating hours updated successfully");
    } catch (error) {
      console.error("Error updating special hours:", error);
    }
  };

  const handleConfirm = () => {
    if (selectedTab === "time") {
      submitWeeklySchedule();
    } else if (selectedTab === "calendar") {
      submitSpecialHours();
    }
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDay(day.dateString);
  };

  const handleTimeChange = (day: string, type: string, value: string) => {
    setWeeklyTime((prevTime) => ({
      ...prevTime,
      [day]: { ...prevTime[day], [type]: value },
    }));
  };

  const applyAll = () => {
    if (selectedDays.length === 0) return;

    const firstSelectedDay = selectedDays[0];
    const firstDayTime = weeklyTime[firstSelectedDay];
    const updatedWeeklyTime = selectedDays.reduce(
      (acc, day) => {
        acc[day] = firstDayTime;
        return acc;
      },
      { ...weeklyTime }
    );

    setWeeklyTime(updatedWeeklyTime);
  };

  const handleDaySelect = (day: string) => {
    const sortedDays = (days: string[]) => {
      const weekOrder = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
    };

    setSelectedDays((prevDays) => {
      const updatedDays = prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];
      return sortedDays(updatedDays);
    });
  };

  const clearSelection = () => {
    setSelectedDay("");
    setSpecialTime({ start: "09:00", end: "17:00" });
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const markedDates = selectedDay
    ? { [selectedDay]: { selected: true, selectedColor: "green" } }
    : {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ร้านที่1</Text>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "time" && styles.activeTab]}
          onPress={() => setSelectedTab("time")}
        >
          <Text style={styles.tabText}>ตั้งเวลา</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "calendar" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("calendar")}
        >
          <Text style={styles.tabText}>ปฏิทิน</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {selectedTab === "time" ? (
          <View>
            <View style={styles.daySelector}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.selectedDayButton,
                  ]}
                  onPress={() => handleDaySelect(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.selectedDayText,
                    ]}
                  >
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row" }}>
              {selectedDays.length > 0 && (
                <>
                  <View>
                    {selectedDays.map((day, index) => (
                      <View key={index} style={styles.timePicker}>
                        <Text style={styles.dayText}>{day}</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={weeklyTime[day].start}
                          onChangeText={(value) =>
                            handleTimeChange(day, "start", value)
                          }
                        />
                        <Text style={styles.timeSeparator}>to</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={weeklyTime[day].end}
                          onChangeText={(value) =>
                            handleTimeChange(day, "end", value)
                          }
                        />
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.applyAllButton}
                    onPress={applyAll}
                  >
                    <Text style={styles.applyAllText}>Apply All</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ) : (
          <View>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              style={styles.calendar}
            />
            {selectedDay ? (
              <View style={styles.timePicker}>
                <View
                  style={{
                    flex: 3,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={styles.timeInput}
                    value={specialTime.start}
                    onChangeText={(value) =>
                      setSpecialTime({ ...specialTime, start: value })
                    }
                  />
                  <Text style={styles.timeSeparator}>to</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={specialTime.end}
                    onChangeText={(value) =>
                      setSpecialTime({ ...specialTime, end: value })
                    }
                  />
                </View>

                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSelection}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.selectDateText}>Please select a date</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleConfirm()}
        >
          <Text style={styles.confirmButtonText}>ยืนยันการตั้งเวลา</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    gap: 20,
  },
  header: {
    color: "#000",
    marginTop: 70,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#757575",
  },
  activeTab: {
    borderRadius: 8,
    backgroundColor: "#2c2c2c",
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  daySelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dayButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  selectedDayButton: {
    backgroundColor: "#2c2c2c",
  },
  dayButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "#fff",
  },
  timePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeInput: {
    color: "#000",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    width: 64,
    textAlign: "center",
  },
  timeSeparator: {
    color: "#000",
    marginHorizontal: 10,
    fontSize: 16,
  },
  dayText: {
    color: "#000",
    width: 84,
  },
  applyAllButton: {
    marginLeft: 10,
    height: 40,
    paddingLeft: 10,
    padding: 10,
    backgroundColor: "green",
    alignItems: "center",
    borderRadius: 5,
  },
  applyAllText: {
    color: "#fff",
    fontWeight: "bold",
  },
  calendar: {
    marginBottom: 20,
  },
  confirmButtonContainer: {
    padding: 15,
    alignItems: "center",
  },
  confirmButton: {
    padding: 15,
    backgroundColor: "green",
    alignItems: "center",
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "red",
    alignItems: "center",
    borderRadius: 5,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectDateText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default SpecialTimeSetting;
