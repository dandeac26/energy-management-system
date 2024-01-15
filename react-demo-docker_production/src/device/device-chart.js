import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DeviceChart() {
  const { deviceId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Device Measurement",
        data: [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        barPercentage: 0.95,
        categoryPercentage: 0.9,
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        console.log(formattedDate);
        const response = await axios.get(
          `http://localhost:5001/measurements/${deviceId}/${formattedDate}`
        );
        console.log(response);

        const measurements = response.data.map((measurement) => ({
          x: new Date(parseInt(measurement.timestamp_value)),
          y: parseFloat(measurement.measurement),
        }));

        setChartData((prevData) => ({
          ...prevData,
          labels: measurements.map((m) => m.x),
          datasets: [
            {
              ...prevData.datasets[0],
              data: measurements,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchData();
  }, [deviceId, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h2>Device Chart for Device ID: {deviceId}</h2>
      <DatePicker
        key={selectedDate.toString()}
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        maxDate={new Date()}
      />
      <Bar
        data={chartData}
        options={{
          scales: {
            x: {
              type: "time",
              time: {
                unit: "minute",

                distribution: "linear",
              },
            },
          },
        }}
      />
    </div>
  );
}

export default DeviceChart;
