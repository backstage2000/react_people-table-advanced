import cn from 'classnames';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { Person } from '../types';
import { getCentury } from '../utils/getCentury';
import { useEffect } from 'react';

type Props = {
  people: Person[];
  allPeople: Person[];
  setPeople: (val: Person[]) => void;
  setIsFilteredEmpty: (val: boolean) => void;
};

export const PeopleFilters: React.FC<Props> = ({
  allPeople,
  setPeople,
  setIsFilteredEmpty,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const centurys = ['16', '17', '18', '19', '20'];

  const { pathname, search } = useLocation();

  const valueQuery = searchParams.get('query') || '';
  const valueCenturys = searchParams.getAll('century');

  function applyFilters(arg?: string) {
    const query = (searchParams.get('query') || '').toLowerCase().trim();
    const centuries = searchParams.getAll('century');
    let result = allPeople;

    console.log('inside');
    console.log('start filter', result);

    if (query) {
      result = result.filter(p => {
        const fields = [p.name, p.motherName, p.fatherName].filter(Boolean);

        return fields.some(f => f?.toLowerCase().includes(query));
      });
    }

    if (centuries.length) {
      result = result.filter(p => {
        const born = getCentury(p.born);
        const died = getCentury(p.died);

        return (
          (born && centuries.includes(born)) ||
          (died && centuries.includes(died))
        );
      });
    }

    if (arg === 'sex=f') {
      result = result.filter(f => f.sex === 'f');
      setPeople(result);
      setIsFilteredEmpty(result.length === 0);

      return;
    }

    setPeople(result);

    setIsFilteredEmpty(result.length === 0);
  }

  useEffect(() => {
    applyFilters();
  }, [searchParams, allPeople]);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value.toLowerCase();

    const params = new URLSearchParams(searchParams);

    if (val.trim()) {
      params.set('query', val);
    } else {
      params.delete('query');
    }

    setSearchParams(params);
  }

  function toggleCentury(c: string) {
    const params = new URLSearchParams(searchParams);
    const current = params.getAll('century');
    const next = current.includes(c)
      ? current.filter(x => x !== c)
      : [...current, c];

    params.delete('century');
    next.forEach(x => params.append('century', x));
    setSearchParams(params);
  }

  function clearFilter() {
    setSearchParams(new URLSearchParams());
  }

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <Link
          className={cn('', {
            'is-active':
              pathname === '/people' &&
              search !== '?sex=m' &&
              search !== '?sex=f',
          })}
          onClick={() => applyFilters('All')}
          to={'.'}
        >
          All
        </Link>
        <Link
          className={cn('', {
            'is-active': search === '?sex=m',
          })}
          to={'/people?sex=m'}
        >
          Male
        </Link>
        <Link
          className={cn('', {
            'is-active': search === '?sex=f',
          })}
          to={'/people?sex=f'}
          onClick={() => {
            applyFilters('sex=f');
          }}
        >
          Female
        </Link>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={valueQuery}
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
                  'is-info': valueCenturys.includes(centur),
                })}
                onClick={() => {
                  toggleCentury(centur);
                }}
                // to={`#/people?centuries=${centur}`}
              >
                {centur}
              </button>
            ))}
          </div>

          <div className="level-right ml-4">
            <Link
              data-cy="centuryALL"
              className={cn('button is-success', {
                'is-outlined': valueCenturys.length,
              })}
              to={'.'}
            >
              All
            </Link>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <Link
          onClick={clearFilter}
          className="button is-link is-outlined is-fullwidth"
          to={`.`}
        >
          Reset all filters
        </Link>
      </div>
    </nav>
  );
};
