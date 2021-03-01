<template>
  <div class="main mx-auto  max-w-screen-lg w-screen bg-indigo-50" id="app">
    <div class="font-bold text-2xl py-3">
      PData WebApp
    </div>
    <div class="p-2 mb-6">
      <highcharts :options="generateOptions"></highcharts>
    </div>
    <div
      v-show="people.length > 0"
      class=" mb-5 flex justify-between overflow-hidden"
    >
      <span class="font-bold text-2xl">
        Patient's Dataset
      </span>
      <span
        @click="
          () => {
            open = !open;
          }
        "
        class="text-indigo-500 cursor-pointer select-none"
        >Expand Content
        <span
          v-if="open"
          class="transform inline-block rotate-90  translate-y-0.5"
        >
          >
        </span>
        <span
          v-if="!open"
          class="transform inline-block -rotate-90 translate-y-0.5"
        >
          >
        </span>
      </span>
    </div>
    <div
      v-show="people.length > 0 && open"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-10"
    >
      <div
        v-for="person in people"
        :key="person.id"
        class="mb-1 bg-indigo-100 p-10 rounded hover:shadow hover:bg-indigo-200  cursor-pointer
      "
      >
        <div>
          <span class="font-medium">Name:</span>
          {{ Object.values(person)[0].name }}
        </div>
        <div>
          <span class="font-medium">Age:</span>
          {{ Object.values(person)[0].age }}
        </div>
        <div>
          <span class="font-medium">Blood Group:</span>
          {{ Object.values(person)[0]["blood-group"] }}
        </div>
      </div>
    </div>
    <div v-show="people.length === 0" class="text-2xl text-center">
      No Data Available Yet
    </div>
  </div>
</template>

<script>
import { people as db } from "./firebase";
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";

const personObject = (person) => Object.values(person)[0];
const ageGroupArray = (array) => [
  array.filter(
    (person) => 18 <= personObject(person).age && personObject(person).age < 22
  ).length,
  array.filter(
    (person) => 22 <= personObject(person).age && personObject(person).age < 26
  ).length,
  array.filter(
    (person) => 26 <= personObject(person).age && personObject(person).age < 30
  ).length,
];

const loadElements = (array) => {
  if (window.localStorage.people) {
    array.push(...JSON.parse(window.localStorage.people));
  } else {
    db.get().then((querySnapshot) =>
      querySnapshot.forEach((doc) => {
        array.push({ [doc.id]: doc.data() });
        window.localStorage.people = JSON.stringify(array);
      })
    );
  }
};
export default {
  name: "App",
  data: function() {
    return {
      people: [],
      open: false,
    };
  },
  mounted() {
    loadElements(this.people);
  },
  components: {
    highcharts: Chart,
  },
  computed: {
    generateOptions: function() {
      const bloodGroups = ["AB", "A", "B", "O"];
      const series = bloodGroups.map((bloodgroup) =>
        ageGroupArray(
          this.people.filter(
            (person) => personObject(person)["blood-group"] === bloodgroup
          )
        )
      );
      const getRowIdx = (idx) => [
        series[0][idx],
        series[1][idx],
        series[2][idx],
        series[3][idx],
      ];
      return {
        chart: {
          type: "column",
        },
        title: {
          text: "Patients Data",
        },
        xAxis: {
          categories: bloodGroups,
          title: {
            text: "Blood Group",
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Number of people",
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color:
                // theme
                (Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color) ||
                "gray",
            },
          },
        },
        legend: {
          align: "right",
          x: -30,
          verticalAlign: "top",
          y: 25,
          floating: true,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || "white",
          borderColor: "#CCC",
          borderWidth: 1,
          shadow: false,
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat:
            "{series.name}: {point.y}<br/>Total people: {point.stackTotal}",
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: "18 <= age < 22",
            data: getRowIdx(0),
          },
          {
            name: "22 <= age < 26",
            data: getRowIdx(1),
          },
          {
            name: "26 <= age < 30",
            data: getRowIdx(2),
          },
        ],
      };
    },
  },
};
</script>

<style></style>
