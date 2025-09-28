import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { Pagination } from "../Pagination/Pagination";
import { Modal } from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";
import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearchQuery(value.trim());
  }, 500);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", searchQuery, page],
    queryFn: () => fetchNotes({ search: searchQuery || undefined, page, perPage: 12 }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast("No notes found for your query.");
    }
  }, [data]);

  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <Toaster position="top-right" reverseOrder={false} />

        <SearchBox
          value={searchQuery}
          onSearch={debouncedSetSearchQuery} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && (
        <NoteList
          notes={data.notes}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onCreated={() => setPage(1)}
          />
        </Modal>
      )}
    </div>
  );
}

const Notes = () => {
    return <div>Notes</div>
};
export default Notes;