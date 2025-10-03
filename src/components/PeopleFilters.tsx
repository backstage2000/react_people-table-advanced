import cn from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { Person } from '../types';
import { getCentury } from '../utils/getCentury';

type Props = {
  people: Person[];
  allPeople: Person[];
  setPeople: (val: Person[]) => void;
  setIsFilteredEmpty: (val: boolean) => void;
};

export const PeopleFilters: React.FC<Props> = ({
  people,
  allPeople,
  setPeople,
  setIsFilteredEmpty,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const centurys = ['16', '17', '18', '19', '20'];

  console.log(`people`, people);
  console.log(`allPeople:`, allPeople);

  const query = searchParams.get('query') || '';
  const century = searchParams.getAll('century') || [];

  function filterCentury(centur: string[]) {
    if (!centur.length) {
      setPeople(allPeople);

      return;
    }

    const res = allPeople.filter(p => {
      const born = getCentury(p.born);
      const died = getCentury(p.died);

      return (born && centur.includes(born)) || (died && centur.includes(died));
    });

    setPeople(res);
  }

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value.toLowerCase();

    const params = new URLSearchParams(searchParams);

    params.set('query', event.target.value);
    setSearchParams(params);

    if (!val) {
      setPeople(allPeople);
      setIsFilteredEmpty(false);

      return;
    }

    const resultFilter = people.filter(person => {
      const fields = [person.name, person.motherName, person.fatherName];

      const result = fields.some(field => {
        const check = field?.toLowerCase().includes(val);

        return check;
      });

      return result;
    });

    setPeople(resultFilter);
    setIsFilteredEmpty(resultFilter.length === 0);
  }

  function toggleCentury(argCentury: string) {
    const params = new URLSearchParams(searchParams);

    const newCenturys = century.includes(argCentury)
      ? century.filter(c => c !== argCentury)
      : [...century, argCentury];

    params.delete('century');

    newCenturys.forEach(c => params.append('century', c));

    setSearchParams(params);

    if (newCenturys.length !== 0) {
      filterCentury(newCenturys);
    }
  }

  function clearFilter() {
    setSearchParams(new URLSearchParams());
    setPeople(allPeople);
  }

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <a className="is-active" href="#/people">
          All
        </a>
        <a className="" href="#/people?sex=m">
          Male
        </a>
        <a className="" href="#/people?sex=f">
          Female
        </a>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={query}
            onChange={handleQueryChange}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {centurys.map(centur => (
              <button
                key={centur}
                data-cy="century"
                className={cn('button mr-1', {
                  'is-info': century.includes(centur),
                })}
                onClick={() => {
                  toggleCentury(centur);
                }}
                // href={`#/people?centuries=${centur}`}
              >
                {centur}
              </button>
            ))}
          </div>

          <div className="level-right ml-4">
            <a
              data-cy="centuryALL"
              className="button is-success is-outlined"
              href="#/people"
            >
              All
            </a>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <a
          onClick={clearFilter}
          className="button is-link is-outlined is-fullwidth"
          href="#/people"
        >
          Reset all filters
        </a>
      </div>
    </nav>
  );
};
