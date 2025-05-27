
    import React, { useState, useMemo } from 'react';
    import { Link } from 'react-router-dom';
    import { useTasks } from '@/context/TaskContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { motion, AnimatePresence } from 'framer-motion';
    import { PlusSquare, Edit3, Trash2, AlertTriangle, Info, Activity, Filter, Search, CalendarDays, LayoutList } from 'lucide-react';
    import { format, formatDistanceToNow, parseISO } from 'date-fns';
    import { useToast } from '@/components/ui/use-toast';

    const TasksListPage = () => {
      const { tasks, deleteTask, updateTask, projects } = useTasks();
      const { toast } = useToast();
      const [searchTerm, setSearchTerm] = useState('');
      const [filterPriority, setFilterPriority] = useState('all');
      const [filterStatus, setFilterStatus] = useState('all');
      const [filterProject, setFilterProject] = useState('all');
      const [sortOrder, setSortOrder] = useState('dueDateAsc'); 

      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const [taskToDelete, setTaskToDelete] = useState(null);

      const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filterPriority !== 'all') {
          filtered = filtered.filter(task => task.priority === filterPriority);
        }
        if (filterStatus !== 'all') {
          filtered = filtered.filter(task => task.status === filterStatus);
        }
        if (filterProject !== 'all') {
          filtered = filtered.filter(task => task.project === filterProject);
        }
        
        return filtered.sort((a, b) => {
          const dateA = parseISO(a.dueDate);
          const dateB = parseISO(b.dueDate);
          switch (sortOrder) {
            case 'dueDateAsc':
              return dateA - dateB;
            case 'dueDateDesc':
              return dateB - dateA;
            case 'priority': 
              const priorityOrder = { High: 0, Medium: 1, Low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'createdAtDesc':
                return parseISO(b.createdAt) - parseISO(a.createdAt);
            default:
              return 0;
          }
        });
      }, [tasks, searchTerm, filterPriority, filterStatus, filterProject, sortOrder]);

      const handleDeleteConfirmation = (task) => {
        setTaskToDelete(task);
        setIsDeleteDialogOpen(true);
      };

      const handleDelete = () => {
        if (taskToDelete) {
          deleteTask(taskToDelete.id);
          setIsDeleteDialogOpen(false);
          setTaskToDelete(null);
        }
      };
      
      const getPriorityIcon = (priority, size = "h-5 w-5") => {
        switch (priority) {
          case 'High': return <AlertTriangle className={`${size} text-red-500`} />;
          case 'Medium': return <Activity className={`${size} text-yellow-500`} />;
          case 'Low': return <Info className={`${size} text-green-500`} />;
          default: return null;
        }
      };

      const getStatusColor = (status) => {
        if (status === 'Completed') return 'border-green-500';
        if (status === 'In Progress') return 'border-blue-500';
        return 'border-gray-500';
      };
      
      const containerVariants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
      };

      return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
          <Card className="professional-card shadow-lg overflow-hidden">
            <CardHeader className="bg-card/50 p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <motion.div initial={{opacity:0, x: -20}} animate={{opacity:1, x:0}} transition={{delay: 0.1}}>
                        <h1 className="text-3xl font-bold gradient-text flex items-center"><LayoutList className="mr-3 h-8 w-8"/> Task Dashboard</h1>
                        <p className="text-muted-foreground">Manage and organize all your tasks efficiently.</p>
                    </motion.div>
                    <motion.div initial={{opacity:0, x: 20}} animate={{opacity:1, x:0}} transition={{delay: 0.2}}>
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Link to="/create-task"><PlusSquare className="mr-2 h-5 w-5" /> Add New Task</Link>
                        </Button>
                    </motion.div>
                </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-6">
                <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 items-end">
                    <div className="relative">
                        <Label htmlFor="search" className="text-sm font-medium text-foreground/80">Search Tasks</Label>
                        <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="search"
                            type="text" 
                            placeholder="Type to search..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 professional-input mt-1"
                        />
                    </div>
                     <div>
                        <Label htmlFor="filterPriority" className="text-sm font-medium text-foreground/80">Priority</Label>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="w-full professional-input mt-1">
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="filterStatus" className="text-sm font-medium text-foreground/80">Status</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full professional-input mt-1">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {projects.length > 0 && (
                        <div>
                            <Label htmlFor="filterProject" className="text-sm font-medium text-foreground/80">Project</Label>
                            <Select value={filterProject} onValueChange={setFilterProject}>
                                <SelectTrigger className="w-full professional-input mt-1">
                                    <SelectValue placeholder="Filter by project" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Projects</SelectItem>
                                    {projects.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                     <div>
                        <Label htmlFor="sortOrder" className="text-sm font-medium text-foreground/80">Sort By</Label>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-full professional-input mt-1">
                                <SelectValue placeholder="Sort tasks" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dueDateAsc">Due Date (Asc)</SelectItem>
                                <SelectItem value="dueDateDesc">Due Date (Desc)</SelectItem>
                                <SelectItem value="priority">Priority</SelectItem>
                                <SelectItem value="createdAtDesc">Created Date (Newest)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>
            </CardContent>
          </Card>

          {filteredAndSortedTasks.length === 0 ? (
             <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="text-center py-12">
                <Filter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold text-foreground">No Tasks Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or create a new task.</p>
                <Button asChild className="mt-6">
                    <Link to="/create-task"><PlusSquare className="mr-2 h-4 w-4" /> Create Task</Link>
                </Button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              <AnimatePresence>
                {filteredAndSortedTasks.map(task => (
                  <motion.div key={task.id} variants={itemVariants} layout>
                    <Card className={`professional-card hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border-l-4 ${getStatusColor(task.status)}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                            <Link to={`/task/${task.id}`} className="hover:underline">{task.title}</Link>
                          </CardTitle>
                          {getPriorityIcon(task.priority)}
                        </div>
                        {task.project && <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full w-fit mt-1">{task.project}</span>}
                      </CardHeader>
                      <CardContent className="flex-grow space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">{task.description || "No description available."}</p>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <CalendarDays className="mr-1.5 h-3.5 w-3.5"/>
                          Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')} ({formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true })})
                        </div>
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
                            task.status === 'Completed' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                            task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                            'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                        }`}>
                            {task.status}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3 border-t border-border/50 flex justify-end space-x-2">
                        <Button variant="outline" size="sm" asChild className="hover:border-primary hover:text-primary transition-colors">
                          <Link to={`/task/${task.id}?edit=true`}>
                            <Edit3 className="h-4 w-4 mr-1.5" /> Edit
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteConfirmation(task)} className="hover:bg-red-700/90 transition-colors">
                          <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="gradient-text">Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the task "{taskToDelete?.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </motion.div>
      );
    };

    export default TasksListPage;
  