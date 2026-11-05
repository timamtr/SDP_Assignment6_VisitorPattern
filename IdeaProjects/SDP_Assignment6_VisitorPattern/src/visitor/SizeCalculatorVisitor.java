package visitor;

import element.Directory;
import element.File;
import element.FileSystemElement;

public class SizeCalculatorVisitor implements Visitor {
    private int totalSize = 0;

    @Override
    public void visitFile(File file) {
        totalSize += file.getSizeInBytes();
    }

    @Override
    public void visitDirectory(Directory directory) {
        for (FileSystemElement child : directory.getChildren()) {
            child.accept(this);
        }
    }

    public int getTotalSize() {
        return totalSize;
    }
}

