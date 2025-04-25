const Persons = ({ persons, onDelete }) => (
    <ul>
      {persons.map((person, index) => (
        <li key={index}>
          {person.name} {person.number} {/* eslint-disable-next-line react/prop-types */}
          <button onClick={() => onDelete(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
);
  
export default Persons;
  