import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
// import "chartjs-plugin-zoom";

// const options = {
//   scales: {
//     x: {
//       type: "time",
//       time: {
//         unit: "minute", // Adjust based on the density of your data points
//         tooltipFormat: "MM/DD/YYYY HH:mm", // Adjust the tooltip format as needed
//       },
//       distribution: "linear", // or 'series' depending on your data
//     },
//     y: {
//       beginAtZero: true, // Set to true if your measurements can be zero
//     },
//   },
//   //   plugins: {
//   //     tooltip: {
//   //       callbacks: {
//   //         label: function(context) {
//   //           // Customize tooltip labels here
//   //           return `Measurement: ${context.parsed.y}`;
//   //         },
//   //       },
//   //     },
//   // zoom: {
//   //   zoom: {
//   //     wheel: {
//   //       enabled: true, // Enable zooming with mouse wheel
//   //       modifierKey: "ctrl", // Could be 'ctrl', 'alt', or 'shift'
//   //     },
//   //     pinch: {
//   //       enabled: true, // Enable zooming with pinch gestures
//   //     },
//   //     mode: "xy", // Enable zooming on both axes
//   //   },
//   //   pan: {
//   //     enabled: true,
//   //     mode: "xy",
//   //     // Require the user to hold down a modifier key to pan the chart
//   //     modifierKey: "ctrl", // Could be 'ctrl', 'alt', or 'shift'
//   //   },
//   // },
//   //   },
//   //   elements: {
//   //     point: {
//   //       radius: 2, // Reduce point radius to make the chart less cluttered
//   //     },
//   //   },
//   maintainAspectRatio: false, // This allows the chart to resize more freely
// };

// const options = {
//   scales: {
//     x: {
//       type: "time",
//       time: {
//         unit: "minute",
//         tooltipFormat: "MM/DD/YYYY HH:mm",
//       },
//       distribution: "linear",
//     },
//     y: {
//       beginAtZero: true,
//     },
//   },
//   maintainAspectRatio: false,
// };

function DeviceChart() {
  const { deviceId } = useParams();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Device Measurement",
        data: [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  });

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:5001/latest-measurements/${deviceId}`
  //         );
  //         console.log(response);
  //         const deviceData = response.data[deviceId]; // Assuming the response is an object with deviceIds as keys
  //         // console.log(deviceData.timestamp);
  //         if (deviceData) {
  //           const formattedData = {
  //             x: new Date(deviceData.timestamp), // Convert timestamp to Date object
  //             y: parseFloat(deviceData.measurement), // Convert measurement to a float
  //           };
  //           console.log(formattedData);

  //           setChartData((prevData) => ({
  //             ...prevData,
  //             labels: [formattedData.x],
  //             datasets: [
  //               {
  //                 ...prevData.datasets[0],
  //                 data: [formattedData],
  //               },
  //             ],
  //           }));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching device data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, [deviceId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/latest-measurements/${deviceId}`
        );
        console.log(response);

        // Map over the array to create chart data points
        const measurements = response.data.map((measurement) => ({
          x: new Date(parseInt(measurement.timestamp_value)), // Convert string to number
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
  }, [deviceId]);

  return (
    <div>
      <h2>Device Chart for Device ID: {deviceId}</h2>
      <Line
        data={chartData}
        options={{
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
            },
          },
        }}
      />
    </div>
  );
}

export default DeviceChart;
