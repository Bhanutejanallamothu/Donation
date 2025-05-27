
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';

    const TaskContext = createContext();

    export const useTasks = () => useContext(TaskContext);

    const initialTasks = [
      {
        id: '1',
        title: 'Develop Homepage UI',
        description: 'Create the main landing page design with React and TailwindCSS. Include hero section, features, and call to action.',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        priority: 'High',
        status: 'In Progress',
        project: 'Website Redesign',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Setup Authentication',
        description: 'Implement user login and registration functionality using a context and local storage.',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        priority: 'High',
        status: 'To Do',
        project: 'Core Features',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Write API Documentation',
        description: 'Document all available API endpoints, request/response formats, and authentication methods.',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        priority: 'Medium',
        status: 'To Do',
        project: 'Documentation',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Test Payment Gateway',
        description: 'Thoroughly test the Stripe integration for various payment scenarios.',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        priority: 'Medium',
        status: 'Completed',
        project: 'E-commerce Module',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      },
       {
        id: '5',
        title: 'Design Marketing Campaign',
        description: 'Plan and design the marketing campaign for the new product launch. Target audience, channels, and messaging.',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
        priority: 'Low',
        status: 'To Do',
        project: 'Marketing',
        createdAt: new Date().toISOString(),
      },
    ];

    export const TaskProvider = ({ children }) => {
      const [tasks, setTasks] = useLocalStorage('taskmaster-tasks', initialTasks);
      const { toast } = useToast();

      const addTask = (task) => {
        const newTask = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString() };
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        toast({
          title: "Task Created",
          description: `Task "${task.title}" has been successfully added.`,
        });
      };

      const updateTask = (updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
        toast({
          title: "Task Updated",
          description: `Task "${updatedTask.title}" has been successfully updated.`,
        });
      };

      const deleteTask = (taskId) => {
        const taskToDelete = tasks.find(task => task.id === taskId);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        if (taskToDelete) {
            toast({
            title: "Task Deleted",
            description: `Task "${taskToDelete.title}" has been deleted.`,
            variant: "destructive",
            });
        }
      };

      const getTaskById = (id) => {
        return tasks.find(task => task.id === id);
      };
      
      const projects = [...new Set(tasks.map(task => task.project).filter(Boolean))];

      return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTaskById, projects }}>
          {children}
        </TaskContext.Provider>
      );
    };
  