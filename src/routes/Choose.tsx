import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

const Choose = () => {
  const { getAll, update, getByID } = useIndexedDB("registrations");
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

  const groups = persons.reduce((groups, person) => {
    let date = "unknown-date";
    if (
      person.date &&
      typeof person.date === "string" &&
      person.date.indexOf("T") > -1
    ) {
      date = person.date.split("T")[0];
    }
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(person);
    return groups;
  }, {});

  const handleChoose = async (key: string) => {
    const group = groups[key];
    const selectedPerson = group[Math.floor(Math.random() * group.length)];
    await update({ ...selectedPerson, selected: true });
    refresh();
  };

  const handleClearSelected = async (id: string) => {
    const selectedPerson = await getByID(id);
    await update({ ...selectedPerson, selected: false });
    refresh();
  };

  return (
    <div style={{ padding: 20 }}>
      <a href="/">Home</a> | <a href="/admin">Admin</a>
      <br />
      <br />
      {Object.keys(groups).map((key) => {
        const selectedPerson = groups[key].find(
          (person: any) => person.selected
        );
        return (
          <>
            <div>
              <b>{key}</b>
            </div>
            <div>{`Total Registrations: ${groups[key].length}`}</div>
            {selectedPerson && (
              <div>
                {`Selected: ${selectedPerson.firstName} ${selectedPerson.lastName}: ${selectedPerson.phone} ${selectedPerson.email}`}
                <button onClick={() => handleClearSelected(selectedPerson.id)}>
                  Reset
                </button>
              </div>
            )}
            {!selectedPerson && (
              <div>
                <button onClick={() => handleChoose(key)}>
                  Randomly Choose Registration
                </button>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default Choose;
