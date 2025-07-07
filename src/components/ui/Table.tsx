
import React from 'react';
import classNames from 'classnames';


export interface CellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}


export const Th: React.FC<CellProps> = ({
  children,
  className = '',
  ...rest
}) => (
  <th
    {...rest}
    className={classNames(
      'px-6 py-3 text-left font-semibold uppercase tracking-wider text-gray-600',
      className,
    )}
  >
    {children}
  </th>
);

export const Td: React.FC<CellProps> = ({
  children,
  className = '',
  ...rest
}) => (
  <td
    {...rest}
    className={classNames(
      'whitespace-nowrap px-6 py-4 text-gray-700',
      className,
    )}
  >
    {children}
  </td>
);
