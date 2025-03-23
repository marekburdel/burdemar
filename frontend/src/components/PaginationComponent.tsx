import React from 'react';
import { Pagination } from '@mui/material';

interface PaginationComponentProps {
    count: number;
    page: number;
    onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ count, page, onPageChange }) => {
    return (
        <Pagination count={count} page={page} onChange={onPageChange} color="primary" />
    );
};

export default PaginationComponent;