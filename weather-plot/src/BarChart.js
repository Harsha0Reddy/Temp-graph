import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);

    const API_KEY = 'dc3805434b0d43ffb03112936242209'; 
    const CITY = 'Hyderabad';
    const DAYS = 30;

    useEffect(() => {
        const fetchWeatherData = async () => {
            const today = new Date();
            const responses = await Promise.all(
                Array.from({ length: DAYS }).map((_, i) => {
                    const date = new Date();
                    date.setDate(today.getDate() - i);
                    const formattedDate = date.toISOString().split('T')[0];
                    return axios.get(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${CITY}&dt=${formattedDate}`);
                })
            );

            const temperatures = responses.map(response => response.data.forecast.forecastday[0].day.avgtemp_c);
            const dates = responses.map((_, i) => {
                const date = new Date();
                date.setDate(today.getDate() - i);
                return date.toLocaleDateString();
            }).reverse();

            setData(temperatures.reverse());
            setLabels(dates.reverse());
        };

        fetchWeatherData();
    }, []);

    const chartData = {
        labels, 
        datasets: [
            {
                label: 'Average Temperature (°C)',
                data, 
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Hyderabad Temp(Last 30 Days)',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `${value}°C`, 
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default BarChart;
