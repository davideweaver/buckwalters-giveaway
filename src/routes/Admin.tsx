import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

const Admin = () => {
  const { getAll, deleteRecord, clear } = useIndexedDB("registrations");
  const [version, setVersion] = useState(0);
  const [persons, setPersons] = useState<any[]>([]);

  useEffect(() => {
    getAll().then((personsFromDB) => {
      setPersons(personsFromDB);
    });
  }, [getAll, version]);

  const refresh = () => {
    setVersion(version + 1);
  };

  const handleDelete = async (personId: string) => {
    await deleteRecord(personId);
    refresh();
  };

  const handleDeleteAll = async () => {
    await clear();
    refresh();
  };

  const cleanPersons = persons.filter((person) => {
    if (
      !person.date ||
      typeof person.date !== "string" ||
      person.date.indexOf("T") < 0
    ) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ padding: 20 }}>
      <a href="/">Home</a> | <a href="/choose">Choose</a>
      <table cellPadding={10}>
        <thead>
          <tr>
            <th>Date</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subscribed</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cleanPersons.map((person) => (
            <tr key={person.id}>
              <td>{person.date}</td>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.email}</td>
              <td>{person.phone}</td>
              <td>{person.subscribed}</td>
              <td>
                <button onClick={() => handleDelete(person.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDeleteAll}>Delete All</button>
      <br />
      <br />
      Version: 5
    </div>
  );
};

export default Admin;
