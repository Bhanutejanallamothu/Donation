
    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate, useLocation } from 'react-router-dom';
    import { useTasks } from '@/context/TaskContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { DatePicker } from '@/components/ui/date-picker';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { ArrowLeft, Edit3, Save, Trash2, CalendarDays, AlertTriangle, Info, Activity, CheckCircle, Tag, AlignLeft } from 'lucide-react';
    import { format, parseISO } from 'date-fns';

    const TaskDetailsPage = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const location = useLocation();
      const { getTaskById, updateTask, deleteTask } = useTasks();
      const { toast } = useToast();

      const [task, setTask] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
      
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [dueDate, setDueDate] = useState(null);
      const [priority, setPriority] = useState('');
      const [project, setProject] = useState('');
      const [status, setStatus] = useState('');

      useEffect(() => {
        const currentTask = getTaskById(id);
        if (currentTask) {
          setTask(currentTask);
          setTitle(currentTask.title);
          setDescription(currentTask.description || '');
          setDueDate(parseISO(currentTask.dueDate));
          setPriority(currentTask.priority);
          setProject(currentTask.project || '');
          setStatus(currentTask.status);
        } else {
          toast({ title: "Task not found", variant: "destructive" });
          navigate('/tasks');
        }
      }, [id, getTaskById, navigate, toast]);

      useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('edit') === 'true') {
          setIsEditing(true);
        }
      }, [location.search]);

      const handleUpdate = (e) => {
        e.preventDefault();
        if (!title || !dueDate) {
          toast({ title: "Missing Information", description: "Title and due date are required.", variant: "destructive" });
          return;
        }
        const updatedTaskData = { 
            ...task, 
            title, 
            description, 
            dueDate: dueDate.toISOString(), 
            priority, 
            project,
            status 
        };
        updateTask(updatedTaskData);
        setTask(updatedTaskData); 
        setIsEditing(false);
        navigate(`/task/${id}`, { replace: true });
      };
      
      const handleDelete = () => {
        deleteTask(id);
        navigate('/tasks');
      };
      
      const getPriorityIcon = (priorityLvl, className = "h-5 w-5") => {
        switch (priorityLvl) {
          case 'High': return <AlertTriangle className={`${className} text-red-500`} />;
          case 'Medium': return <Activity className={`${className} text-yellow-500`} />;
          case 'Low': return <Info className={`${className} text-green-500`} />;
          default: return <Info className={`${className} text-gray-400`} />;
        }
      };

      const getStatusIcon = (statusLvl, className = "h-5 w-5") => {
        switch (statusLvl) {
          case 'To Do': return <AlignLeft className={`${className} text-gray-500`} />;
          case 'In Progress': return <Activity className={`${className} text-blue-500`} />;
          case 'Completed': return <CheckCircle className={`${className} text-green-500`} />;
          default: return <AlignLeft className={`${className} text-gray-400`} />;
        }
      };


      if (!task) {
        return <div className="text-center py-10">Loading task details...</div>;
      }

      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
      };
      
      const inputMotionProps = {
        whileHover: { scale: 1.01 },
        whileFocus: { scale: 1.01, boxShadow: "0px 0px 6px rgba(var(--primary-rgb), 0.4)" }
      };

      return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={() => navigate('/tasks')} className="mb-6 text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
          </Button>

          <Card className="professional-card shadow-xl">
            {!isEditing ? (
              <>
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-3xl font-bold gradient-text mb-1">{task.title}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="ml-auto">
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </div>
                  {task.project && <CardDescription className="text-md text-primary flex items-center"><Tag className="mr-2 h-4 w-4"/>{task.project}</CardDescription>}
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                    <p className="text-foreground/90">{task.description || <span className="italic text-muted-foreground">No description provided.</span>}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="mr-3 h-5 w-5 text-primary/80" />
                      <div>
                        <span className="font-medium text-foreground/90">Due Date:</span>
                        <span className="ml-1 text-foreground/80">{format(parseISO(task.dueDate), 'PPP')}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getPriorityIcon(task.priority)}
                      <span className="font-medium text-foreground/90 ml-3">Priority:</span>
                      <span className="ml-1 text-foreground/80">{task.priority}</span>
                    </div>
                    <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <span className="font-medium text-foreground/90 ml-3">Status:</span>
                        <span className="ml-1 text-foreground/80">{task.status}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarDays className="mr-3 h-5 w-5 text-primary/80" />
                        <div>
                            <span className="font-medium text-foreground/90">Created:</span>
                            <span className="ml-1 text-foreground/80">{format(parseISO(task.createdAt), 'PPP p')}</span>
                        </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-4 flex justify-end">
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                    </Button>
                </CardFooter>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-2xl font-semibold gradient-text">Edit Task</CardTitle>
                  <CardDescription>Update the details of your task.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                    <motion.div {...inputMotionProps}>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 professional-input" required />
                    </motion.div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <motion.div {...inputMotionProps}>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[100px] professional-input" />
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                      <motion.div {...inputMotionProps}>
                      <DatePicker date={dueDate} setDate={setDueDate} className="mt-1 w-full professional-input" />
                      </motion.div>
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                      <motion.div {...inputMotionProps}>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="w-full mt-1 professional-input"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                      </Select>
                      </motion.div>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project" className="text-sm font-medium">Project / Category</Label>
                      <motion.div {...inputMotionProps}>
                      <Input id="project" value={project} onChange={(e) => setProject(e.target.value)} className="mt-1 professional-input" placeholder="e.g., Q1 Sprint"/>
                      </motion.div>
                    </div>
                    <div>
                        <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                        <motion.div {...inputMotionProps}>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full mt-1 professional-input"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        </motion.div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-4 flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => { setIsEditing(false); navigate(`/task/${id}`, { replace: true }); }} className="px-5 py-2">Cancel</Button>
                  <Button type="submit" className="px-5 py-2 bg-primary hover:bg-primary/90"><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </motion.div>
      );
    };

    export default TaskDetailsPage;
  