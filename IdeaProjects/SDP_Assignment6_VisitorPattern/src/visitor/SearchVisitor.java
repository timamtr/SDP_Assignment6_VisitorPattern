package visitor;

import element.Directory;
import element.File;
import element.FileSystemElement;
import java.util.ArrayList;
import java.util.List;

public class SearchVisitor implements Visitor {
    private final String keyword;
    private final List<File> foundFiles = new ArrayList<>();

    public SearchVisitor(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public void visitFile(File file) {
        if (file.getName().contains(keyword)) {
            foundFiles.add(file);
        }
    }

    @Override
    public void visitDirectory(Directory directory) {
        for (FileSystemElement child : directory.getChildren()) {
            child.accept(this);
        }
    }

    public List<File> getFoundFiles() {
        return List.copyOf(foundFiles);
    }
}
