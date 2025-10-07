import cn from 'classnames';
import { Loader } from './Loader';
import { Person } from '../types';
import { PersonLink } from '../utils/PersonLink';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { SearchLink } from './SearchLink';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  people: Person[];
  isLoading: boolean;
  selectedSlug: string;
  isError: boolean;
  isEmpty: boolean;
};

export const PeopleTable: React.FC<Props> = ({
  people,
  isLoading,
  selectedSlug,
  isError,
  isEmpty,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  function toggleSort(field: string) {
    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order');

    const next = new URLSearchParams(searchParams);

    if (currentSort !== field) {
      next.set('sort', field);

      next.delete('order');
    } else if (!currentOrder) {
      next.set('order', 'desc');
    } else {
      next.delete('sort');
      next.delete('order');
    }

    setSearchParams(next);
  }

  function iconClassFor(nameSort: string) {
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');

    const isActive = sort === nameSort;

    return classNames('fas', {
      'fa-sort': !isActive,
      'fa-sort-up': isActive && !order,
      'fa-sort-down': isActive && order === 'desc',
    });
  }

  return (
    <div className="box table-container">
      {isLoading && <Loader />}

      {!isLoading && !isError && isEmpty && (
        <p data-cy="noPeopleMessage">
          There are no people matching the current search criteria
        </p>
      )}

      {isError && (
        <p data-cy="peopleLoadingError" className="has-text-danger">
          Something went wrong
        </p>
      )}
      {!isLoading && !isError && !people.length && !isEmpty && (
        <p data-cy="noPeopleMessage">There are no people on the server</p>
      )}

      {!isLoading && !isError && people.length > 0 && (
        <table
          data-cy="peopleTable"
          className="table is-striped is-hoverable is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Name
                  <SearchLink
                    onClick={e => {
                      e.preventDefault();
                      toggleSort('name');
                    }}
                    params={{ sort: 'name' }}
                  >
                    <span className="icon">
                      <i className={iconClassFor('name')} />
                    </span>
                  </SearchLink>
                </span>
              </th>
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Sex
                  <SearchLink
                    params={{ sort: 'sex' }}
                    onClick={e => {
                      e.preventDefault();
                      toggleSort('sex');
                    }}
                  >
                    <span className="icon">
                      <i className={iconClassFor('sex')} />
                    </span>
                  </SearchLink>
                </span>
              </th>
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Born
                  <SearchLink
                    params={{ sort: 'born' }}
                    onClick={e => {
                      e.preventDefault();
                      toggleSort('born');
                    }}
                  >
                    <span className="icon">
                      <i className={iconClassFor('born')} />
                    </span>
                  </SearchLink>
                </span>
              </th>
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Died
                  <SearchLink
                    onClick={e => {
                      e.preventDefault();
                      toggleSort('died');
                    }}
                    params={{ sort: 'died' }}
                  >
                    <span className="icon">
                      <i className={iconClassFor('died')} />
                    </span>
                  </SearchLink>
                </span>
              </th>
              <th>Mother</th>
              <th>Father</th>
            </tr>
          </thead>

          <tbody>
            {people?.map(person => {
              const mother = people.find(p => p.name === person.motherName);
              const father = people.find(p => p.name === person.fatherName);

              return (
                <tr
                  className={cn('', {
                    'has-background-warning': selectedSlug === person.slug,
                  })}
                  key={person.slug}
                  data-cy="person"
                >
                  <td>
                    <PersonLink person={person} />
                  </td>

                  <td>{person.sex}</td>
                  <td>{person.born}</td>
                  <td>{person.died}</td>
                  <td>
                    {mother ? (
                      <PersonLink person={mother}>
                        {person.motherName}
                      </PersonLink>
                    ) : (
                      person.motherName || '-'
                    )}
                  </td>
                  <td>
                    {father ? (
                      <PersonLink person={father}>
                        {person.fatherName}
                      </PersonLink>
                    ) : (
                      person.fatherName || '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
