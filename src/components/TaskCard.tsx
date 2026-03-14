'use client';
import { useState } from 'react';
import styles from './TaskCard.module.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', cls: 'pending' },
  'in-progress': { label: 'In Progress', cls: 'inProgress' },
  completed: { label: 'Completed', cls: 'completed' },
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cfg = STATUS_CONFIG[task.status];
  const date = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(task._id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={`${styles.status} ${styles[cfg.cls]}`}>{cfg.label}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && (
        <p className={styles.desc}>{task.description}</p>
      )}
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          className={`${styles.deleteBtn} ${confirmDelete ? styles.confirm : ''}`}
          onClick={handleDelete}
          disabled={deleting}
          onBlur={() => setConfirmDelete(false)}
        >
          {deleting ? '…' : confirmDelete ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
