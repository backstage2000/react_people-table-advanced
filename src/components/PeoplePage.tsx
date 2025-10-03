import { PeopleFilters } from './PeopleFilters';

import { PeopleTable } from './PeopleTable';
import { Person } from '../types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPeople } from '../api';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [allPeople, setAllPeople] = useState<Person[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);
  const [isFilteredEmpty, setIsFilteredEmpty] = useState(false);

  const { slug } = useParams();

  const selectedSlug = slug ? slug : '';

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    const fetchPeople = async () => {
      try {
        const result = await getPeople();

        setPeople(result);
        setAllPeople(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);

        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          {!!allPeople.length && (
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters
                allPeople={allPeople}
                people={people}
                setPeople={setPeople}
                setIsFilteredEmpty={setIsFilteredEmpty}
              />
            </div>
          )}

          <div className="column">
            <PeopleTable
              people={people}
              isLoading={isLoading}
              selectedSlug={selectedSlug}
              isError={isError}
              isEmpty={isFilteredEmpty}
            />
          </div>
        </div>
      </div>
    </>
  );
};
