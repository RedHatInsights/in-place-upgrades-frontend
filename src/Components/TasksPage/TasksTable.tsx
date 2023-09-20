import React, { useEffect, useState } from 'react';
import { Button, Grid, GridItem, Icon, Pagination, Skeleton, Text, TextContent, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, ExternalLinkAltIcon, InProgressIcon } from '@patternfly/react-icons';
import { ActionsColumn, ExpandableRowContent, Table, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';

import { tasksFetchExecutedTaskDetail, tasksFetchExecutedTasks } from '../../api';
import { ExecutedTask } from './types';

type TasksTableProps = {
  slug: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TasksTable = ({ slug }: TasksTableProps) => {
  const [executedTasks, setExecutedTasks] = useState([] as ExecutedTask[]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoadingExecutedTasks, setIsLoadingExecutedTasks] = useState(false);

  const [activeSortIndex, setActiveSortIndex] = useState(2);
  const [activeSortDirection, setActiveSortDirection] = useState('asc' as 'asc' | 'desc');
  const [expandedIds, setExpandedIds] = useState([] as string[]);

  const fetchData = (page, perPage, sortIndex, sortDirection) => {
    setIsLoadingExecutedTasks(true);
    tasksFetchExecutedTasks(slug, createPath(page, perPage, sortIndex, sortDirection)).then((fetchedExecutedTasks) => {
      setExecutedTasks(fetchedExecutedTasks.data);
      setTotal(fetchedExecutedTasks.meta.count);
      setIsLoadingExecutedTasks(false);
    });
  };

  useEffect(() => {
    fetchData(page, perPage, activeSortIndex, activeSortDirection);
  }, []);

  const cols = {
    col1: { name: 'Task' },
    col2: { name: 'Systems' },
    col3: { name: 'Status' },
    col4: { name: 'Run date/time' },
    length: 4,
  };
  const sortMapper = ['title', 'systems_count', 'status', 'end_time'];

  const createPath = (page, perPage, sortIndex, sortDirection) => {
    const limit = `limit=${perPage}`;
    const offset = `offset=${(page - 1) * perPage}`;
    const direction = sortDirection === 'asc' ? '' : '-';
    const sort = `sort=${direction}${sortMapper[sortIndex]}`;
    return `&${limit}&${offset}&${sort}`;
  };

  const onSetPage = (_event, pageNumber) => {
    setPage(pageNumber);
    fetchData(pageNumber, perPage, activeSortIndex, activeSortDirection);
  };

  const onPerPageSelect = (_event, perPage) => {
    setPage(1);
    setPerPage(perPage);
    fetchData(1, perPage, activeSortIndex, activeSortDirection);
  };

  const buildPagination = (variant) => (
    <Pagination
      itemCount={total}
      page={page}
      perPage={perPage}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      variant={variant}
      isCompact={variant === 'top'}
    />
  );

  const getTitle = (id, taskTitle) => (
    <TextContent>
      <Text component="a" key={`task-title-${id}`} href={`/insights/tasks/executed/${id}`} rel="noreferrer" target="_blank">
        #{id} {taskTitle}
      </Text>
    </TextContent>
  );

  const getFormattedTime = (time) => {
    return new Date(time).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: 'UTC',
    });
  };

  const getEndTime = (time, status) => {
    if (status === 'Running') {
      return 'Running';
    }
    return getFormattedTime(time);
  };

  const calculateDurationTime = (start, end, status) => {
    if (status === 'Running') {
      return '';
    }
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(duration / 1000 / 60);
    const seconds = Math.floor((duration / 1000) % 60);
    if (minutes === 0) {
      return `(${seconds}s)`;
    }
    return `(${minutes}m ${seconds}s)`;
  };

  const getStatus = (status) => {
    let icon;
    if (status === 'Completed') {
      icon = (
        <Icon status="success" isInline title="Completed">
          <CheckCircleIcon />
        </Icon>
      );
    } else if (status === 'Running') {
      icon = (
        <Icon status="info">
          <InProgressIcon />
        </Icon>
      );
    } else {
      icon = (
        <Icon status="danger">
          <ExclamationCircleIcon />
        </Icon>
      );
    }

    return (
      <TextContent>
        {icon} {status}
      </TextContent>
    );
  };

  const loadinSkeletons = [...Array(perPage)].map((_, index) => (
    <Tbody key={index}>
      <Tr key={index}>
        {[...Array(cols.length + 1)].map((_, index) => (
          <Td key={index}>
            <Skeleton />
          </Td>
        ))}
      </Tr>
    </Tbody>
  ));

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
      fetchData(page, perPage, index, direction);
    },
    columnIndex,
  });

  const fetchTaskDetails = (id) => {
    tasksFetchExecutedTaskDetail(id).then((fetchedTask) => {
      const newExecutedTasks = [...executedTasks];
      const index = newExecutedTasks.findIndex((task) => task.id === id);
      newExecutedTasks[index].details = {
        initiated_by: fetchedTask.initiated_by,
        start_time: fetchedTask.start_time,
        end_time: fetchedTask.end_time,
        alerts_count: fetchedTask.jobs.reduce((acc, job) => {
          if (job.status !== 'Success') return acc + 1;
          return acc + job.results.alert;
        }, 0),
      };
      setExecutedTasks(newExecutedTasks);
    });
  };

  const getTaskDetails = (id) => {
    const task = executedTasks.find((task) => task.id === id);
    if (task?.details === undefined) {
      fetchTaskDetails(id);
      return <Skeleton />;
    }

    const { details } = task;

    return (
      <Grid hasGutter>
        <GridItem span={3}>
          <TextContent>
            <Text component="h4" key={`task-details-initiated-${id}`}>
              Initiated by:
            </Text>
            <Text component="p" key={`task-details-initiated-val-${id}`}>
              {details.initiated_by}
            </Text>
          </TextContent>
        </GridItem>
        <GridItem span={3}>
          <TextContent>
            <Text component="h4" key={`task-details-start-${id}`}>
              Run start:
            </Text>
            <Text component="p" key={`task-details-start-val-${id}`}>
              {getFormattedTime(details.start_time)}
            </Text>
          </TextContent>
        </GridItem>
        <GridItem span={3}>
          <TextContent>
            <Text component="h4" key={`task-details-end-${id}`}>
              Run end:
            </Text>
            <Text component="p" key={`task-details-end-val-${id}`}>
              {getEndTime(details.end_time, task.status)} {calculateDurationTime(details.start_time, details.end_time, task.status)}
            </Text>
          </TextContent>
        </GridItem>
        <GridItem span={3}>
          <TextContent>
            <Text component="h4" key={`task-details-systems-${id}`}>
              Systems with alerts:
            </Text>
            <Text component="p" key={`task-details-systems-val-${id}`}>
              {details.alerts_count}
            </Text>
          </TextContent>
        </GridItem>
        <GridItem span={12}>
          <Button
            variant="secondary"
            component="a"
            icon={<ExternalLinkAltIcon />}
            key={`task-details-button-${id}`}
            href={`/insights/tasks/executed/${id}`}
            rel="noreferrer"
            target="_blank"
          >
            View full details
          </Button>
        </GridItem>
      </Grid>
    );
  };

  const isRowExpanded = (rowIndex) => expandedIds.includes(rowIndex);
  const setIsRowExpanded = (rowIndex, isExpanded) => {
    if (isExpanded) {
      setExpandedIds([...expandedIds, rowIndex]);
    } else {
      setExpandedIds(expandedIds.filter((id) => id !== rowIndex));
    }
  };

  return (
    <React.Fragment>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem variant="pagination">{buildPagination('top')}</ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Tasks table">
        <Thead>
          <Tr>
            <Th />
            <Th>{cols.col1.name}</Th>
            <Th sort={getSortParams(1)}>{cols.col2.name}</Th>
            <Th sort={getSortParams(2)}>{cols.col3.name}</Th>
            <Th sort={getSortParams(3)}>{cols.col4.name}</Th>
          </Tr>
        </Thead>
        {isLoadingExecutedTasks
          ? loadinSkeletons
          : executedTasks.map((task, rowIndex) => (
              <Tbody isExpanded={isRowExpanded(task.id)} key={task.id}>
                <Tr key={task.id}>
                  <Td
                    expand={{
                      rowIndex,
                      isExpanded: isRowExpanded(task.id),
                      onToggle: () => setIsRowExpanded(task.id, !isRowExpanded(task.id)),
                      expandId: 'composable-expandable-example',
                    }}
                  />
                  <Td dataLabel={cols.col1.name}>{getTitle(task.id, task.task_title)}</Td>
                  <Td dataLabel={cols.col2.name}>{task.systems_count}</Td>
                  <Td dataLabel={cols.col3.name}>{getStatus(task.status)}</Td>
                  <Td dataLabel={cols.col4.name}>{getEndTime(task.end_time, task.status)}</Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={[
                        {
                          title: 'Run this task again',
                          onClick: () => console.log('TODO: run task again'),
                          isDisabled: true,
                        },
                        {
                          title: 'Delete',
                          onClick: () => console.log('TODO: delete task'),
                          isDisabled: true,
                        },
                      ]}
                    />
                  </Td>
                </Tr>
                {isRowExpanded(task.id) && (
                  <Tr isExpanded={isRowExpanded(task.id)} key={`expanded-${task.id}`}>
                    <Td />
                    <Td colSpan={cols.length}>
                      <ExpandableRowContent>{getTaskDetails(task.id)}</ExpandableRowContent>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            ))}
      </Table>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem variant="pagination">{buildPagination('bottom')}</ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    </React.Fragment>
  );
};

export default TasksTable;
