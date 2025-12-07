
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import LoadingChangePage from '../Share/Loading/LoadingChangePage';

type ClientOnlyProps = { children: ReactNode };
const ClientOnly = (props: ClientOnlyProps) => {
  const { children } = props;

  return children;
};

export default dynamic(() => Promise.resolve(ClientOnly), {
  ssr: false,
  loading: () => <LoadingChangePage />
});