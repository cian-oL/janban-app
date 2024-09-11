import { Column } from "../types/kanbanTypes";

export const kanbanColumns: Column[] = [
  {
    columnId: "blocked",
    title: "Blocked",
  },
  {
    columnId: "playReady",
    title: "Play-Ready",
  },
  {
    columnId: "inDevelopment",
    title: "In Development",
  },
  {
    columnId: "testReady",
    title: "Test-Ready",
  },
  {
    columnId: "testInProgress",
    title: "Test in Progress",
  },
  {
    columnId: "demoReady",
    title: "Demo-Ready",
  },
  {
    columnId: "complete",
    title: "Complete",
  },
];

export const issueCategories: string[] = ["Story", "Bug", "Task", "Spike"];
