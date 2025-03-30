const Header = ({ name }) => {
    return <h1>{name}</h1>;
  };
  
const Part = ({ part }) => {
    return (
        <p>
        {part.name} {part.exercises}
        </p>
    );
};

const Total = ({ parts }) => {
    return (
        <p>
        <strong>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} excercises</strong>
        </p>
    );
}

const Content = ({ parts }) => {
    return (
        <div>
        {parts.map(part => (
            <Part key={part.id} part={part} />
        ))}
        <Total parts={parts} />
        </div>
    );
};

const Course = ({ course }) => {
    return (
        <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        </div>
    );
};

export default Course;
