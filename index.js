const Joi = require("joi");
const express = require("express");

const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
  { id: 4, name: "course 4" },
];

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:courseId", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.courseId));
  if (!course) return res.status(404).send("Course not found");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const validation = validateCourse(req.body);
  if (validation.error)
    return res.status(400).send(validation.error.details[0].message);
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:courseId", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.courseId));
  if (!course) return res.status(404).send("Course not found");

  const validation = validateCourse(req.body);
  if (validation.error)
    return res.status(400).send(validation.error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:courseId", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.courseId));
  if (!course) return res.status(404).send("Course not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}
